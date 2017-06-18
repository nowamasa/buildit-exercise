
#!/usr/bin/env bash

echo "Installing git hooks"
echo "current working directory:"
echo $PWD
echo "Copying git hook files from ./git-hooks/install/ to .git/hooks..."

cp -R ./git-hooks/install/. .git/hooks/

echo "Assigning execute permission to the git hook files copied into .git/hooks ...."
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
