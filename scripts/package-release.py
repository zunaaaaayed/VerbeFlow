"""Build a deterministic, dependency-free extension ZIP from runtime files only."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
REPO = 'https://github.com/zunaaaaayed/VerbeFlow'


def runtime_files(root):
    manifest = json.loads((root / 'manifest.json').read_text())
    files = set()

    def include(name):
        candidate = root / name
        path = candidate.resolve()
        if candidate.is_symlink() or not path.is_relative_to(root.resolve()) or not path.is_file():
            raise ValueError(f'Missing or unsafe runtime file: {name}')
        name = path.relative_to(root.resolve()).as_posix()
        if name in files:
            return
        files.add(name)
        text = path.read_text() if path.suffix in ('.js', '.html', '.css') else ''
        if path.suffix == '.js':
            for dependency in re.findall(r'(?:from\s*|import\s*\(?\s*)[\'\"](\.[^\'\"]+)[\'\"]', text):
                include((path.parent / dependency).relative_to(root).as_posix())
        if path.suffix == '.html':
            for dependency in re.findall(r'(?:src|href)=[\'\"]([^\'\"]+)[\'\"]', text):
                if not dependency.startswith(('https:', 'http:')):
                    include((path.parent / dependency).relative_to(root).as_posix())
        if path.suffix == '.css':
            for dependency in re.findall(r'url\([\'\"]?([^\)\'\"]+)', text):
                include((path.parent / dependency).relative_to(root).as_posix())
        for asset in re.findall(r'assets/[A-Za-z0-9_/.-]+\.(?:png|ttf|woff2?)', text):
            include(asset)

    include('manifest.json')
    include(manifest['background']['service_worker'])
    include(manifest['side_panel']['default_path'])
    for name in [*manifest['icons'].values(), *manifest['action']['default_icon'].values()]:
        include(name)
    for name in ['README.md', 'LICENSE', 'NOTICE', 'vendor/lefff/LICENSE-LGPLLR.txt',
                 'assets/fonts/CormorantGaramond-OFL.txt', 'assets/fonts/InstrumentSerif-OFL.txt', 'assets/fonts/Lora-OFL.txt']:
        include(name)
    return files


def build_release(root, output, source=False):
    root = root.resolve()
    manifest = json.loads((root / 'manifest.json').read_text())
    version = manifest['version']
    if json.loads((root / 'package.json').read_text())['version'] != version:
        raise ValueError('Manifest/package versions disagree')
    tag = f'v{version}'
    release_url = f'{REPO}/releases/tag/{tag}'
    source_url = f'{REPO}/releases/download/{tag}/VerbeFlow-{version}-source.zip'
    output.mkdir(parents=True, exist_ok=True)
    files = runtime_files(root)
    entries = {name: (root / name).read_bytes() for name in files}

    # Links to non-installed docs lead to the matching published source revision.
    def readme_link(match):
        target = match[1]
        if target.startswith(('https:', 'http:', '#')) or target in files:
            return match[0]
        return f']({REPO}/blob/{tag}/{target})'
    entries['README.md'] = re.sub(r'\]\(([^)]+)\)', readme_link, entries['README.md'].decode()).encode()
    entries['NOTICE'] += (f'\nRelease {tag}\nComplete corresponding source and resource modifications: {source_url}\n'
                          f'Release page: {release_url}\nPaths to development documents above refer to that source archive.\n').encode()
    entries['THIRD_PARTY_NOTICES.txt'] = (
        'Lefff / french-verbs-lefff 3.4.0\n'
        'Original Lefff: Benoît Sagot, Lionel Clément and collaborators.\n'
        'Extraction and packaging: Ludan Stoecklé / RosaeNLG.\n'
        'Linguistic resource license: LGPLLR, reproduced in vendor/lefff/LICENSE-LGPLLR.txt.\n'
        'VerbeFlow modifications: filtered identities and incomplete paradigms, normalized NA to null,\n'
        'lossless shared templates for five simple tenses, reviewed payer/pouvoir variants,\n'
        'and explicit catalog assignments. Original archive and editable modifications are\n'
        f'available in the corresponding source: {source_url}\n'
        f'Attribution and modification notice: {REPO}/blob/{tag}/docs/LEFFF_SOURCE.md\n'
        'Bundled fonts retain SIL OFL 1.1. Full licenses are in assets/fonts/.\n'
    ).encode()
    archive = output / f'VerbeFlow-{version}.zip'
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for name, data in sorted(entries.items()):
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 4, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            bundle.writestr(info, data)
    with zipfile.ZipFile(archive) as bundle:
        if bundle.testzip() is not None or 'manifest.json' not in bundle.namelist():
            raise ValueError('Invalid extension archive')
    assets = [archive]
    if source:
        source_archive = output / f'VerbeFlow-{version}-source.zip'
        subprocess.run(['git', 'archive', '--format=zip', f'--prefix=VerbeFlow-{version}-source/',
                        f'--output={source_archive}', 'HEAD'], cwd=root, check=True)
        assets.append(source_archive)
    checksums = ''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n' for path in assets)
    (output / 'SHA256SUMS').write_text(checksums)
    return archive


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', action='store_true', help='Also archive the committed HEAD as corresponding source')
    args = parser.parse_args()
    path = build_release(ROOT, ROOT / 'dist', source=args.source)
    print(f'Built {path.name}: {path.stat().st_size:,} bytes; runtime files and legal notices only.')
