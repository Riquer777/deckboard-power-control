const { execFile } = require('node:child_process');
const { dialog } = require('electron');
const { Extension, InputTypes, Platforms, log } = require('deckboard-kit');

class PowerControlExtension extends Extension {
  constructor() {
    super();
    this.name = 'Power Control (Linux)';
    this.platforms = [Platforms.linux];
    this.inputs = [
      {
        label: 'Power Control',
        value: 'power-control',
        icon: 'power-off',
        fontIcon: 'fas',
        color: '#34495e',
        input: [
          {
            label: 'Action',
            ref: 'powerAction',
            type: InputTypes.select,
            items: [
              { label: 'Shut Down', value: 'shutdown' },
              { label: 'Restart', value: 'restart' }
            ]
          },
          {
            label: 'Require Confirmation',
            ref: 'confirmation',
            type: InputTypes.checkbox,
            default: true
          }
        ]
      }
    ];
  }

  async execute(action, { powerAction, confirmation = true } = {}) {
    if (action !== 'power-control') return;

    const operations = {
      shutdown: {
        command: 'poweroff',
        title: 'Shut Down Computer',
        message: 'Are you sure you want to shut down your computer?'
      },
      restart: {
        command: 'reboot',
        title: 'Restart Computer',
        message: 'Are you sure you want to restart your computer?'
      }
    };

    const selected = operations[powerAction];
    if (!selected) {
      log.warn('Invalid power action:', powerAction);
      return;
    }

    if (confirmation) {
      const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Cancel', 'Confirm'],
        defaultId: 0,
        cancelId: 0,
        title: selected.title,
        message: selected.message,
        detail: 'Please save your work before proceeding.'
      });

      if (result.response !== 1) {
        log.info('Operation cancelled:', powerAction);
        return;
      }
    }

    execFile('/usr/bin/systemctl', [selected.command], { timeout: 10000 }, (error, _stdout, stderr) => {
      if (error) {
        const reason = String(stderr || error.message || 'Unknown error').trim();
        log.error('Power operation failed:', reason);
        dialog.showMessageBox({
          type: 'error',
          buttons: ['OK'],
          title: 'Power Operation Failed',
          message: 'Linux could not process the request.',
          detail: reason
        }).catch(dialogError => log.error('Failed to display error message:', dialogError));
        return;
      }

      log.info('Request sent to systemd:', selected.command);
    });
  }
}

module.exports = new PowerControlExtension();
