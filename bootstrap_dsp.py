import os
import subprocess
import re

def run_dsp(*args):
    cmd = ["python3", "dsp-cli.py", "--root", "."] + list(args)
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout.strip()

def get_desc(filepath):
    if "index.css" in filepath: return "Global CSS: frosted glass themes, dark mode states, and minimalist layouts"
    if "tokenMap.ts" in filepath: return "Design tokens for UI/UX implementation"
    if "tailwind.config.ts" in filepath: return "Tailwind configuration matching UI_HANDOFF"
    if "UI_HANDOFF.md" in filepath: return "Design System and UI component specifications"
    if "main.py" in filepath: return "FastAPI backend entrypoint"
    if "main.tsx" in filepath: return "React frontend entrypoint"
    if "Layout.tsx" in filepath: return "Core layout wrapper with sidebar and topbar"
    if "Dashboard.tsx" in filepath: return "Main dashboard view"
    if "api.ts" in filepath: return "Frontend API client configuration"
    
    parts = filepath.split('/')
    return f"{parts[-1]} file in {parts[-2] if len(parts)>1 else 'root'}"

def main():
    with open("files.txt") as f:
        files = [line.strip() for line in f if line.strip() and not line.endswith('.gitkeep')]

    uid_map = {}

    print("Creating objects...")
    for file in files:
        desc = get_desc(file)
        uid = run_dsp("create-object", file, desc)
        if uid.startswith("obj-"):
            uid_map[file] = uid

    print(f"Created {len(uid_map)} objects.")
    
    # Simple dependency mapping
    print("Mapping dependencies...")
    for file in files:
        if file not in uid_map: continue
        uid = uid_map[file]
        
        # Backend dependencies
        if "backend/app/routers" in file:
            if "./backend/app/database.py" in uid_map:
                run_dsp("add-import", uid, uid_map["./backend/app/database.py"], "Database access")
            if "./backend/app/schemas.py" in uid_map:
                run_dsp("add-import", uid, uid_map["./backend/app/schemas.py"], "Data validation")
            if "./backend/app/models.py" in uid_map:
                run_dsp("add-import", uid, uid_map["./backend/app/models.py"], "ORM models")
            
        if "backend/app/main.py" in file:
            for router_file in [f for f in files if "backend/app/routers" in f]:
                if router_file in uid_map:
                    run_dsp("add-import", uid, uid_map[router_file], "Registers router")

        # Frontend dependencies
        if "frontend/src/components" in file or "frontend/src/pages" in file:
            if "./frontend/src/design-tokens/tokenMap.ts" in uid_map:
                run_dsp("add-import", uid, uid_map["./frontend/src/design-tokens/tokenMap.ts"], "Uses design tokens")
            if "./frontend/src/index.css" in uid_map:
                run_dsp("add-import", uid, uid_map["./frontend/src/index.css"], "Applies global styles and glassmorphism")
            
        if file.endswith(".tsx") and not "main.tsx" in file:
            if "./frontend/src/components/ui/Card.tsx" in uid_map:
                run_dsp("add-import", uid, uid_map["./frontend/src/components/ui/Card.tsx"], "Uses UI Card component")
                
        if "main.tsx" in file:
            if "./frontend/src/App.tsx" in uid_map:
                run_dsp("add-import", uid, uid_map["./frontend/src/App.tsx"], "Renders root component")
            if "./frontend/src/index.css" in uid_map:
                run_dsp("add-import", uid, uid_map["./frontend/src/index.css"], "Imports global styles")

    print("DSP Bootstrap complete.")

if __name__ == "__main__":
    main()
