import importlib.util
from pathlib import Path
import tempfile
import subprocess
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('package_release', ROOT / 'scripts/package-release.py')
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)


class ReleaseTests(unittest.TestCase):
    def test_runtime_closure_and_licenses_without_development_files(self):
        files = packager.runtime_files(ROOT)
        self.assertTrue({'manifest.json', 'sidepanel.html', 'src/app.js', 'src/background.js',
                         'src/data/lefff-reference.js', 'src/normalize.js', 'src/styles.css',
                         'vendor/lefff/LICENSE-LGPLLR.txt', 'assets/fonts/Lora-OFL.txt'} <= files)
        self.assertFalse(any(p.startswith(('tests/', 'scripts/', 'docs/', '.git/', 'data/')) for p in files))
        self.assertNotIn('src/validate.js', files)
        self.assertNotIn('assets/brand/verbeflow-master.png', files)
        self.assertEqual([p for p in files if p.endswith('.md')], ['README.md'])

    def test_zip_is_reproducible_and_manifest_is_at_root(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            archive = packager.build_release(ROOT, output)
            first = archive.read_bytes()
            self.assertEqual(first, packager.build_release(ROOT, output).read_bytes())
            with zipfile.ZipFile(archive) as bundle:
                self.assertIsNone(bundle.testzip())
                self.assertIn('manifest.json', bundle.namelist())
                self.assertIn('THIRD_PARTY_NOTICES.txt', bundle.namelist())
                self.assertIn(b'-source.zip', bundle.read('NOTICE'))
                self.assertNotIn(b'](docs/', bundle.read('README.md'))

    def test_packaged_engine_runs_without_repository_or_development_dependencies(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            archive = packager.build_release(ROOT, output)
            installed = output / 'installed'
            with zipfile.ZipFile(archive) as bundle:
                bundle.extractall(installed)
            engine = (installed / 'src/engine.js').as_uri()
            code = f'''import {{conjugate,lookup,example}} from {engine!r};
                if(conjugate('abaisser','present')[0].text !== 'abaisse') throw Error('reference missing');
                if(!lookup('j’acquiers').some(m=>m.infinitive==='acquérir' && m.personIndex===0)) throw Error('lookup missing');
                if(!example('parler','present').french) throw Error('learning example missing');
                if(!conjugate('abaisser','passe').every(f=>f.available===false)) throw Error('unsafe compound');'''
            subprocess.run(['node', '--experimental-default-type=module', '--input-type=module', '-e', code],
                           cwd=installed, check=True, capture_output=True, text=True)


if __name__ == '__main__':
    unittest.main()
