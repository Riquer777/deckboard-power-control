# Deckboard Power Control — Linux

Extensão Linux para desligar ou reiniciar o computador diretamente pelo Deckboard.

Esta é uma adaptação Linux do projeto original de Riva Farabi. O código original e seus créditos são preservados na licença MIT.

## Identificador exclusivo

- Nome no Deckboard: `Power Control (Linux)`
- Pacote: `riquer777-power-control-linux`
- Arquivo gerado: `riquer777-power-control-linux.asar`

O nome do arquivo ASAR é derivado de `package` em `extension.yml`. O identificador do pacote, o nome em `package.json` e o nome do arquivo devem permanecer alinhados.

## Recursos

- Ação independente para desligar.
- Ação independente para reiniciar.
- Confirmação antes de executar qualquer operação.
- Integração com systemd por meio de `systemctl`.
- Tratamento e registro de erros.
- Disponível somente em Linux.

## Requisitos

- Linux com systemd (Linux Mint, Ubuntu, Debian e derivados).
- Deckboard com suporte a extensões.
- Node.js 18 ou superior e npm.
- `deckboard-kit-cli` instalado e disponível no PATH.

Instale o CLI, se necessário:

```bash
npm install --global --prefix "$HOME/.local" deckboard-kit-cli
```

## Instalação e build

Clone o projeto em uma pasta de desenvolvimento (não dentro da pasta de extensões):

```bash
git clone https://github.com/Riquer777/deckboard-power-control.git
cd deckboard-power-control
npm install
npm run check
```

Para gerar o pacote:

```bash
rm -rf /tmp/.temp
npm run build
```

O arquivo será criado em:

```text
dist/riquer777-power-control-linux.asar
```

Para instalar automaticamente no diretório padrão do Deckboard (`~/deckboard/extensions`):

```bash
npm run install:deckboard
```

Ou copie manualmente:

```bash
mkdir -p ~/deckboard/extensions
cp dist/riquer777-power-control-linux.asar ~/deckboard/extensions/
```

Feche completamente e abra novamente o Deckboard. Remova versões antigas desta extensão, especialmente `deckboard-power-control.asar`, para evitar duplicatas.

Se o Deckboard estiver usando um diretório de extensões diferente, copie o arquivo ASAR para o diretório efetivamente utilizado pela instalação.

## Funcionamento

Após confirmar a ação, a extensão executa um dos comandos:

| Ação | Comando |
| --- | --- |
| Desligar | `/usr/bin/systemctl poweroff` |
| Reiniciar | `/usr/bin/systemctl reboot` |

Os comandos são executados diretamente, sem shell e sem interpolação. Em sessões gráficas locais, o systemd/logind normalmente autoriza a operação. Se a política do sistema negar a solicitação, a extensão registra o erro e tenta exibi-lo.

## Desenvolvimento

Verifique a sintaxe do JavaScript com:

```bash
npm run check
```

Gere o pacote ASAR com:

```bash
npm run build
```

## Créditos e licença

Adaptação Linux mantida por Riquer777.

Projeto original: https://github.com/rivafarabi/deckboard-power-control

Copyright original: Riva Farabi, 2019.

Licença MIT. Consulte o arquivo [LICENSE](LICENSE).
