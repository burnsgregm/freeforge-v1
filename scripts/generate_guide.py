import os
import argparse

def get_lang(ext):
    mapping = {
        '.ts': 'typescript', '.tsx': 'typescript',
        '.js': 'javascript', '.jsx': 'javascript',
        '.py': 'python', '.tf': 'hcl',
        '.yml': 'yaml', '.yaml': 'yaml',
        '.ps1': 'powershell', '.json': 'json',
        '.css': 'css', '.html': 'html',
        '.md': 'markdown'
    }
    return mapping.get(ext, '')

def append_file(file_path, guide_path):
    if not os.path.exists(file_path): return
    rel_path = os.path.relpath(file_path)
    ext = os.path.splitext(file_path)[1]
    lang = get_lang(ext)
    
    with open(guide_path, 'a', encoding='utf-8') as f:
        f.write(f'\n#### {rel_path}\n')
        f.write(f'```{lang}\n')
        try:
            with open(file_path, 'r', encoding='utf-8') as source:
                f.write(source.read())
        except Exception:
             f.write("Binary or unreadable file.")
        f.write('\n```\n')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('guide_path')
    args = parser.parse_args()
    
    # Root
    root_files = ['deploy.ps1', 'manual_deploy.ps1', 'cloudbuild.yaml', 'docker-compose.yml', '.gcloudignore']
    with open(args.guide_path, 'a', encoding='utf-8') as f: f.write('\n## 1. Root\n')
    for rf in root_files: append_file(rf, args.guide_path)
    
    # Infrastructure
    with open(args.guide_path, 'a', encoding='utf-8') as f: f.write('\n## 2. Infrastructure\n')
    for root, _, files in os.walk('infrastructure'):
        for file in files:
            if file.endswith('.tf'):
                append_file(os.path.join(root, file), args.guide_path)
    
    # Server
    with open(args.guide_path, 'a', encoding='utf-8') as f: f.write('\n## 3. Server\n')
    for root, _, files in os.walk('server'):
        if 'node_modules' in root or 'dist' in root or 'coverage' in root: continue
        for file in files:
            if file.endswith(('.ts', '.json')) or file == 'Dockerfile':
                 append_file(os.path.join(root, file), args.guide_path)

    # Simulation
    with open(args.guide_path, 'a', encoding='utf-8') as f: f.write('\n## 4. Simulation\n')
    for root, _, files in os.walk('simulation'):
        if '__pycache__' in root or 'venv' in root: continue
        for file in files:
            if file.endswith('.py') or file == 'requirements.txt' or file == 'Dockerfile':
                 append_file(os.path.join(root, file), args.guide_path)
                 
    # Frontend
    with open(args.guide_path, 'a', encoding='utf-8') as f: f.write('\n## 5. Frontend\n')
    for root, _, files in os.walk('frontend'):
        if 'node_modules' in root or 'dist' in root or 'coverage' in root: continue
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css', '.html', '.json')) or file == 'Dockerfile':
                 append_file(os.path.join(root, file), args.guide_path)

if __name__ == '__main__':
    main()
