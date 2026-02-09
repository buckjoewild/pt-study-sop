='gpt-5.3-codex'
='xhigh'
=Get-Content -Raw subagent_prompt.txt
codex exec --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check -m  -c 
