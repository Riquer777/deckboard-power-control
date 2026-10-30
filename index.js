const { execFile } = require('node:child_process');
const { dialog } = require('electron');
const { Extension, Platforms, Icons, log } = require('deckboard-kit');

const ACTIONS = {
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

class PowerControlExtension extends Extension {
  constructor() {
    super();
    this.name = 'Power Control (Linux)';
    this.platforms = [Platforms.linux];
    this.inputs = [
      {
        label: 'Desligar computador',
        value: 'shutdown',
        icon: 'power',
        fontIcon: Icons.ionicons,
        color: '#c0392b'
      },
      {
        label: 'Reiniciar computador',
        value: 'restart',
        icon: 'refresh',
        fontIcon: Icons.ionicons,
        color: '#d68910'
      }
    ];
  }

  async execute(action) {
    const selected = ACTIONS[action];
    if (!selected) {
      log.warn('Ação desconhecida:', action);
      return;
    }

    const confirmation = await dialog.showMessageBox({
      type: 'warning',
      buttons: ['Cancelar', 'Confirmar'],
      defaultId: 0,
      cancelId: 0,
      title: selected.title,
      message: selected.message,
      detail: 'Salve seu trabalho antes de continuar.'
    });

    if (confirmation.response !== 1) {
      log.info('Operação cancelada:', action);
      return;
    }

    // Executa o comando fixo diretamente, sem shell e sem interpolação.
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
