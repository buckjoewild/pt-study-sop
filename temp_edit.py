import re

with open(r'C:\pt-study-sop\dashboard_rebuild\client\src\pages\brain.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = '''                <div className="border-t border-primary/50 p-3">
                  <div className="flex gap-2 items-center">'''

new = '''                <div className="border-t border-primary/50 p-3">
                  {/* Mode Selector */}
                  <div className="flex gap-2 mb-2">
                    <span className="font-terminal text-xs text-muted-foreground self-center">MODE:</span>
                    {(["all", "obsidian", "anki", "metrics"] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={brainChatMode === mode ? "default" : "outline"}
                        size="sm"
                        className={`rounded-none font-arcade text-[10px] h-7 px-2 ${
                          brainChatMode === mode ? "bg-primary text-black" : "border-secondary"
                        }`}
                        onClick={() => setBrainChatMode(mode)}
                      >
                        {mode.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">'''

if old in content:
    content = content.replace(old, new, 1)
    with open(r'C:\pt-study-sop\dashboard_rebuild\client\src\pages\brain.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Mode selector added')
else:
    print('ERROR: Pattern not found')
