# Guia de leitura pessoal — Entendendo Algoritmos

**Livro:** Aditya Y. Bhargava, *Entendendo Algoritmos: um guia ilustrado para programadores e outros curiosos*, edição brasileira da Novatec, 2017. Esta organização considera o sumário do PDF pessoal apresentado pelo estudante (354 páginas) e não reproduz o conteúdo do livro.

**Acesso:** importe o PDF que você possui legitimamente em **Orbit → Biblioteca → Meus PDFs**. Ele ficará somente no seu navegador (IndexedDB); não será enviado ao GitHub. Também é possível consultar [a página oficial da editora](https://novatec.com.br/livros/entendendo-algoritmos/).

**Direitos autorais:** esta edição pertence à Novatec/Manning e declara todos os direitos reservados. A licença MIT da BibliotecaDev não abrange automaticamente as obras de terceiros. Não faça commit deste PDF no repositório público.

## Leitura aplicada às férias (2 horas por sessão)

Em cada encontro, use cerca de 25 minutos para leitura e anotações, 65 minutos para implementação sem copiar, 20 minutos para testes, e 10 minutos para explicar o que aprendeu. O livro utiliza exemplos em Python 2.7; as suas implementações poderão ser feitas em C, C++ ou Rust, conforme a atividade, e comparadas com Java.

| Etapa | Livro | Exercício individual verificável |
| --- | --- | --- |
| 1 | Capítulo 1 — Introdução a algoritmos, pesquisa binária, Big O | Implementar busca linear e binária; testar lista vazia, um item, valores ausentes e duplicados; justificar as complexidades |
| 2 | Capítulo 2 — Arrays, listas encadeadas e ordenação por seleção | Escrever uma lista encadeada pequena e selection sort; comparar acessos e inserções |
| 3 | Capítulo 3 — Recursão e pilha de chamadas | Resolver três problemas de modo iterativo e recursivo, explicar cada caso-base |
| 4 | Capítulo 4 — Quicksort e dividir para conquistar | Implementar quicksort, testar vetores ordenados/reversos/com elementos repetidos e explicar pior caso |
| 5 | Capítulo 5 — Tabelas hash | Criar mini tabela hash para chaves textuais com tratamento de colisões; justificar capacidade e busca |
| 6 | Capítulo 6 — Grafos e pesquisa em largura | Implementar BFS com fila; descobrir caminho mais curto em grafo não ponderado |
| 7 | Capítulo 7 — Dijkstra | Resolver caminhos mínimos com pesos não negativos e verificar os resultados com casos pequenos calculados à mão |
| 8 | Capítulo 8 — Algoritmos gulosos | Resolver problema de seleção de atividades e apontar contraexemplo para estratégia que falha |
| 9 | Capítulo 9 — Programação dinâmica | Implementar problema da mochila com uma tabela e comparar com solução ingênua em entradas pequenas |
| Extensão | Capítulos 10 e 11 | Registrar conceitos úteis para aprofundamento, sem criar obrigação de concluir durante as férias |

## Integração com o PathLab CLI

Utilize grafos pequenos definidos em arquivos de teste. Cada algoritmo precisa de: entrada válida, casos-limite, teste automatizado ou comparação reproduzível, indicação de complexidade e explicação das condições necessárias para funcionar.

O projeto final deve distinguir **BFS** (distância pelo número de arestas em grafos não ponderados) e **Dijkstra** (menor custo total em grafos com pesos não negativos). As soluções devem ser implementações próprias.

## Biblioteca pública do Orbit

Os PDFs redistribuíveis de [Open Data Structures](README.md) servem para estruturas de dados e análises mais aprofundadas. Seus autores disponibilizam essas edições sob licença Creative Commons Attribution. Eles **não** substituem a edição comercial de Bhargava anexada pelo estudante.

> Evidência de conclusão: commits, exercícios e explicações suas. Ler um capítulo, sozinho, não equivale a dominar o assunto.
