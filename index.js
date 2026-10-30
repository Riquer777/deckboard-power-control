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
            label: 'Ação',
            ref: 'powerAction',
            type: InputTypes.select,
            items: [
              { label: 'Desligar', value: 'shutdown' },
              { label: 'Reiniciar', value: 'restart' }
            ]
          },
          {
            label: 'Pedir confirmação',
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
        title: 'Desligar computador',
        message: 'Deseja realmente desligar o computador?'
      },
      restart: {
        command: 'reboot',
        title: 'Reiniciar computador',
        message: 'Deseja realmente reiniciar o computador?'
      }
    };

    const selected = operations[powerAction];
    if (!selected) {
      log.warn('Ação de energia inválida:', powerAction);
      return;
    }

    if (confirmation) {
      const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Cancelar', 'Confirmar'],
        defaultId: 0,
        cancelId: 0,
        title: selected.title,
        message: selected.message,
        detail: 'Salve seu trabalho antes de continuar.'
      });

      if (result.response !== 1) {
        log.info('Operação cancelada:', powerAction);
        return;
      }
    }

    execFile('/usr/bin/systemctl', [selected.command], { timeout: 10000 }, (error, _stdout, stderr) => {
      if (error) {
        const reason = String(stderr || error.message || 'Erro desconhecido').trim();
        log.error('Falha na operação de energia:', reason);
        dialog.showMessageBox({
          type: 'error',
          buttons: ['OK'],
          title: 'Falha na operação de energia',
          message: 'O Linux não aceitou a solicitação.',
          detail: reason
        }).catch(dialogError => log.error('Falha ao exibir mensagem:', dialogError));
        return;
      }

      log.info('Solicitação enviada ao systemd:', selected.command);
    });
  }
}

module.exports = new PowerControlExtension();
