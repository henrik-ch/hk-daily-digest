{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv daily digest";

  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.nodejs-16_x pkgs.yarn ];

  enterShell = ''
    hello
    git --version
  '';

  # https://devenv.sh/languages/
  languages.nix.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";
}
