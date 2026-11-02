# Deckboard Power Control — Linux

A Linux extension for shutting down or restarting your computer directly from Deckboard.

This is a Linux adaptation of the original project by Riva Farabi. The original code and its credits are preserved under the MIT License.

## Unique Identifier

- Deckboard name: `Power Control (Linux)`
- Package: `riquer777-power-control-linux`
- Generated file: `riquer777-power-control-linux.asar`

The ASAR filename is derived from the `package` field in `extension.yml`. The package identifier, the name in `package.json`, and the generated filename must remain consistent.

## Features

- Dedicated shutdown action.
- Dedicated restart action.
- Confirmation prompt before executing either operation.
- systemd integration through `systemctl`.
- Error handling and logging.
- Linux-only support.

## Requirements

- Linux with systemd (Linux Mint, Ubuntu, Debian, and derivatives).
- Deckboard with extension support.
- Node.js 18 or later and npm.
- `deckboard-kit-cli` installed and available in PATH.

Install the CLI if necessary:

```bash
npm install --global --prefix "$HOME/.local" deckboard-kit-cli
```

## Installation and Build

Clone the project into a development directory (not inside the extensions directory):

```bash
git clone https://github.com/Riquer777/deckboard-power-control.git
cd deckboard-power-control
npm install
npm run check
```

To build the package:

```bash
rm -rf /tmp/.temp
npm run build
```

The generated file will be located at:

```text
dist/riquer777-power-control-linux.asar
```

To automatically install it into Deckboard's default extensions directory (`~/deckboard/extensions`):

```bash
npm run install:deckboard
```

Alternatively, copy it manually:

```bash
mkdir -p ~/deckboard/extensions
cp dist/riquer777-power-control-linux.asar ~/deckboard/extensions/
```

Fully close and restart Deckboard. Remove older versions of this extension, especially `deckboard-power-control.asar`, to avoid duplicate entries.

If Deckboard uses a different extensions directory, copy the ASAR file into the directory actually used by your installation.

## How It Works

After the user confirms the action, the extension executes one of the following commands:

| Action | Command |
| --- | --- |
| Shutdown | `/usr/bin/systemctl poweroff` |
| Restart | `/usr/bin/systemctl reboot` |

Commands are executed directly, without a shell or string interpolation. In local graphical sessions, systemd/logind normally authorizes these operations. If system policy denies the request, the extension logs the error and attempts to display it.

## Development

Check the JavaScript syntax using:

```bash
npm run check
```

Build the ASAR package using:

```bash
npm run build
```

## Credits and License

Linux adaptation maintained by Riquer777.

Original project: https://github.com/rivafarabi/deckboard-power-control

Original copyright: Riva Farabi, 2019.

MIT License. See the [LICENSE](LICENSE) file.
