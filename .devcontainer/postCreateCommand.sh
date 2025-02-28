#!/bin/bash

echo alias p=\"pnpm\" >> ~/.oh-my-zsh/oh-my-zsh.sh
echo alias pi=\"pnpm i\" >> ~/.oh-my-zsh/oh-my-zsh.sh
echo alias pd=\"pnpm dev\" >> ~/.oh-my-zsh/oh-my-zsh.sh
echo alias pb=\"pnpm build\" >> ~/.oh-my-zsh/oh-my-zsh.sh
echo alias pu=\"pnpm update --interactive --latest\" >> ~/.oh-my-zsh/oh-my-zsh.sh
git config --global --add safe.directory '*'
git config --global alias.co checkout
apt update -y

read -p "Deseja usar o Vim como editor do git? (Y/N): " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  git config --global core.editor "vi"
  export GIT_EDITOR=vi
fi
