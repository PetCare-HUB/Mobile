const { execSync } = require('child_process');

/**
 * O app.json segue sendo a configuracao estatica. Este arquivo só acrescenta o
 * que precisa ser resolvido na hora do build: qual commit gerou este binario.
 *
 * A tela "Sobre o app" existe para que o avaliador consiga conferir que o APK
 * instalado corresponde a um commit do repositorio. Isso só funciona se o valor
 * vier do build de verdade, nao de uma constante escrita a mao.
 */

function git(comando) {
  return execSync(`git ${comando}`, { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
}

function commit() {
  // Em build na EAS o repositorio chega sem historico completo, mas a propria
  // EAS expoe o commit em variavel de ambiente.
  const daEas = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (daEas) {
    return { hash: daEas.slice(0, 7), sujo: false };
  }

  try {
    return {
      hash: git('rev-parse --short HEAD'),
      // Build feito com arquivo alterado e nao commitado nao corresponde ao
      // commit que o avaliador vai abrir no GitHub. A tela avisa.
      sujo: git('status --porcelain').length > 0,
    };
  } catch {
    return { hash: 'indisponivel', sujo: false };
  }
}

module.exports = ({ config }) => {
  const { hash, sujo } = commit();

  return {
    ...config,
    extra: {
      ...config.extra,
      commitHash: hash,
      commitSujo: sujo,
      geradoEm: new Date().toISOString(),
    },
  };
};
