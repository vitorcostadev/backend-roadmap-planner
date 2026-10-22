# Orbit — Plano de Estudos Backend

Site estático pessoal para acompanhar **203 aulas (406 horas, 29 semanas)** de Java, SQL, Spring Boot e engenharia backend, a partir do plano em Excel.

**Prévia funcional:** https://raw.githack.com/vitorcostadev/backend-roadmap-planner/main/index.html

## Funcionalidades

- Calendário mensal e semanal; planejamento por data inicial e dias disponíveis.
- Reagendamento individual por arrastar e soltar ou pela ficha da aula.
- Teoria, exercício, revisão, evidência e fontes para cada dia.
- Progresso por nível (N1–N3), horas reais e notas pessoais.
- Biblioteca de 34 fontes, desafios, backlog e contrato de API LigaLab.
- Rubricas e 30 testes de aceitação; backup do progresso em JSON.
- Layout responsivo, modo claro/escuro e sem dependência de backend.

## Execução local

Abra `index.html` no navegador ou execute `python -m http.server 8000` na raiz e acesse `http://localhost:8000`.

Os arquivos `data.js` e `app.js` devem permanecer na mesma pasta de `index.html`.

## Privacidade e persistência

O progresso fica no `localStorage` **deste navegador e desta origem**. Não há contas ou sincronização com a nuvem. Use **Exportar progresso** para fazer backup e **Importar backup** para restaurar. O progresso na prévia RawGitHack não será automaticamente transferido se o domínio público mudar.

## GitHub Pages e domínio

GitHub Pages está configurado para publicar a partir de `main` (raiz). O perfil GitHub possui uma configuração de domínio personalizado `vitorcosta.me` no repositório `vitorcostadev.github.io`; o domínio é servido atualmente pela Heroku e não roteia o caminho deste projeto. **Isso faz a URL de Pages retornar 404**, embora o build de Pages seja concluído. A configuração do domínio não foi alterada por este projeto.

## Conteúdo

Plano baseado nas seções **Plano diário**, **Semanas**, **Biblioteca**, **Projeto - Escopo**, **API e Dados**, **Backlog**, **Rubricas**, **Desafios**, **Entrevistas** e **Prova final** da planilha de estudos, com 203 aulas e carga diária de 2 horas.
