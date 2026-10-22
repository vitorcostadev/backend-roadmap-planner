# Orbit — Study OS

**[Abrir Orbit no GitHub Pages](https://vitorcostadev.github.io/backend-roadmap-planner/)**

Aplicação estática para organizar duas trilhas complementares:

| Trilha | Período | Conteúdo | Carga prevista |
| --- | --- | --- | --- |
| **Backend Java — Níveis 1 a 3** | Configurável | Java, SQL, Spring Boot, testes, segurança, Docker, CI/CD e LigaLab API | 203 aulas · 406h |
| **Computer Science Lab — Férias 2026/27** | 07/12/2026 a 01/03/2027 | Algoritmos, estruturas de dados, C/memória, Linux/redes, inglês técnico e PathLab CLI | 69 aulas · 138h |

A trilha das férias **não repete Java/Spring Boot**: reforça conhecimentos de Ciência da Computação e engenharia de software que complementam a formação backend.

## Livros abertos para estudo

A [biblioteca do Orbit](biblioteca/README.md) inclui PDFs com licença aberta de *Open Data Structures* (Java, C++ e pseudocódigo), além do link oficial para baixar *Pro Git*. Todos aparecem na aba **Biblioteca** do site. Os livros comerciais encontrados na BibliotecaDev são apenas referências bibliográficas.

## Livros pessoais (não publicados)

No menu **Biblioteca → Meus PDFs**, você pode importar legitimamente sua cópia de *Entendendo Algoritmos*, de Aditya Bhargava. O arquivo fica apenas no IndexedDB do navegador, sem upload para o GitHub ou backend; ele não integra o backup JSON. Consulte o [guia de leitura](biblioteca/GUIA_ENTENDENDO_ALGORITMOS.md) para exercícios associados ao Computer Science Lab. O PDF comercial não é redistribuído publicamente.

## Funcionalidades

- Navegação em dois planos com progresso **separado**.
- Calendário mensal e semanal para ambos os planos.
- Backend: data inicial e dias da semana configuráveis, reagendamento de aulas, projetos e critérios de aceitação.
- Férias: calendário próprio, domingos livres por padrão, pausas pré-configuradas em 24/25/31 de dezembro e 1º de janeiro, seleção de dias de estudo, abertura de datas e reagendamento de sessões.
- Aulas das férias com teoria, exercício, critério de aceitação, fonte, anotações, horas realizadas e evidências.
- Biblioteca do roadmap original, desafios e validação do projeto LigaLab.
- **PathLab CLI**, projeto integrador das férias com grafos, algoritmos de caminhos, dados de teste, testes e documentação.
- Interface responsiva, tema claro/escuro e funcionamento sem servidor próprio.

## Organização das férias

- Duração: **85 dias corridos** (incluindo as duas datas-limite).
- Dias com estudo por padrão: segunda a sábado, exceto pausas de fim de ano.
- **69 sessões** de 120 minutos, com 25 min teoria, 65 min prática, 20 min testes e 10 min revisão.
- Distribuição: 28 aulas de algoritmos, 17 de C/memória, 14 de Linux/redes, 7 de comunicação técnica e 3 de integração.
- Se você configurar menos dias do que os 69 necessários, o Orbit sinaliza as aulas sem agendamento; não desloca o período para depois de 01/03/2027.

## Persistência e privacidade

Todos os registros são salvos no `localStorage` do **navegador e domínio atuais**. Não existem contas ou sincronização entre aparelhos nesta versão.

**Exportar progresso** gera um JSON com o cronograma original e os registros das férias; **Importar backup** restaura ambos. Backups antigos (sem dados de férias) continuam aceitos e preservam o plano de férias que já estiver no navegador.

Não publique seus backups no repositório: eles podem incluir anotações pessoais e evidências.

## Execução local

Abra `index.html` ou execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Mantenha os arquivos `index.html`, `styles.css`, `data.js`, `vacation-data.js`, `vacation.js` e `app.js` na mesma pasta.

## Ferramentas de aprendizagem — atualização 1.2

- **Reorganizar:** prévia das aulas pendentes distribuídas a partir de uma data de retomada, capacidade configurável de 0/2/4h por dia da semana, respeitando pausas, datas manuais e aulas concluídas. **Nenhuma alteração é feita sem confirmação.**
- **Revisões:** recuperação ativa das sessões concluídas, com intervalos sugeridos de 1, 3, 7, 14 e 30 dias conforme a autoavaliação.
- **Simulado:** banco de 15 perguntas originais e rodadas de cinco questões sobre algoritmos, C, sistemas, redes e documentação, com feedback explicado. Não substitui testes de programação.
- Esses dados adicionais permanecem no **mesmo backup JSON** das férias e no armazenamento local. Não há sincronização na nuvem.

## Ajustes de confiabilidade do calendário

- As datas remarcadas manualmente são reservadas antes da distribuição automática: o Orbit não coloca silenciosamente duas aulas no mesmo horário.
- As capacidades semanais de 0, 2 ou 4 horas influenciam tanto a agenda padrão quanto a prévia de reorganização; conflitos remanescentes são destacados.
- Reorganizações anteriores permanecem identificadas como automáticas para que possam ser feitas novamente. Aulas concluídas e remarcações manuais continuam protegidas.
- Todo esse estado acompanha a exportação/importação do backup JSON; não existe sincronização em nuvem.

## O que ainda está planejado

- Painel integrado de domínio por competência (a ser aprofundado com testes práticos).
- Sincronização segura entre dispositivos (requer backend/autenticação; não é oferecida pelo `localStorage`).
- Melhorias adicionais de acessibilidade e interação touch para reagendamento.

## Publicação

GitHub Pages configurado na branch `main`, raiz do repositório, sem domínio personalizado:
https://vitorcostadev.github.io/backend-roadmap-planner/
