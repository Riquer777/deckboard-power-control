# Deckboard Power Control — Linux

Extensão para desligar ou reiniciar um computador Linux diretamente pelo Deckboard.

Esta é uma adaptação Linux do projeto original de Riva Farabi. O código original e seus créditos são preservados na licença MIT.

## Recursos

- Ação para desligar o computador.
- Ação para reiniciar o computador.
- Confirmação antes de executar qualquer operação.
- Integração com systemd por meio de `systemctl`.
- Tratamento e registro de erros.

## Requisitos

- Linux com systemd (Linux Mint, Ubuntu, Debian e derivados).
- Deckboard com suporte a extensões.
- Node.js 18 ou superior e npm.

## Instalação

Clone a extensão no diretório de extensões do Deckboard. Exemplo:

```bash
mkdir -p ~/deckboard/extensions
cd ~/deckboard/extensions
git clone https://github.com/Riquer777/deckboard-power-control.git
cd deckboard-power-control
npm install
npm run check
```

Reinicie o Deckboard depois da instalação.

> Se o seu Deckboard utiliza outro diretório de extensões, use esse caminho no lugar de `~/deckboard/extensions`.

## Funcionamento

Após confirmar a ação, a extensão executa um dos comandos:

| Ação | Comando |
| --- | --- |
| Desligar | `/usr/bin/systemctl poweroff` |
| Reiniciar | `/usr/bin/systemctl reboot` |

Os comandos são executados diretamente, sem shell e sem exigir que o usuário configure `sudo`. Em sessões gráficas locais, o systemd/logind normalmente autoriza a operação. Se a política do sistema negar a solicitação, a extensão registra o erro e tenta exibi-lo.

## Desenvolvimento

Verifique a sintaxe do JavaScript com:

```bash
npm run check
```

## Créditos e licença

Adaptação Linux mantida por Riquer777.

Projeto original: https://github.com/rivafarabi/deckboard-power-control

Copyright original: Riva Farabi, 2019.

Licença MIT. Consulte o arquivo [LICENSE](LICENSE).
