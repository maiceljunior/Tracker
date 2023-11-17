// Dark mode

// function lightMode() {
//   const backgroundColor = document.querySelector("body");
//   const buttonTexto = document.querySelector(".light-mode");
//   const backgroundInfo1 = document.querySelector(".table");
//   const backgroundInfo2 = document.querySelector(".table2");
//   const backgroundInfo3 = document.querySelector(".inserir-dados");

//   backgroundColor.classList.add("light-body");
//   buttonTexto.innerHTML = "Dark mode";
//   backgroundInfo1.classList.add("light-mode-table");
//   backgroundInfo2.classList.add("light-mode-table2");
//   backgroundInfo3.classList.add("light-mode-inserir-dados");
// }
let contador = JSON.parse(localStorage.getItem("contador")) || 0;

const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
const dataMeses = JSON.parse(localStorage.getItem("transacoesData")) || {
  Janeiro: [],
  Fevereiro: [],
  Março: [],
  Abril: [],
  Maio: [],
  Junho: [],
  Julho: [],
  Agosto: [],
  Setembro: [],
  Outubro: [],
  Novembro: [],
  Dezembro: [],
};
const chaves = Object.keys(dataMeses);

function ordenarTransacoes(ordemTransacao) {
  const order = {
    Salário: 1,
    "Entrada-extra": 2,
    "Fatura-Kenzie": 3,
    "Fatura-externa": 4,
    "Fatura-interna-(PF)": 5,
    "Fatura-interna-(PJ)": 6,
    "Gastos-extras": 7,
  };

  return ordemTransacao.sort((a, b) => order[a.option] - order[b.option]);
}

// CRUD

// Create
let saldoTotal = 0;

function adicionarTransacao() {
  const tipoTransacao = document.getElementById("tipo-transacao").value;
  const valor = parseFloat(document.getElementById("valor").value);

  if (tipoTransacao === "entrada") {
    saldoTotal.entradas.push(valor);
  } else if (tipoTransacao === "despesa") {
    saldoTotal.saidas.push(valor);
  }

  atualizarSaldo();
}

// Read
function atualizarSaldo() {
  saldoTotal = 0;
  transacoes.forEach((it) => {
    if (it.tipo === "entrada") {
      saldoTotal = saldoTotal + it.valor;
    } else {
      saldoTotal = saldoTotal - it.valor;
    }
  });

  const somaTotal = document.querySelector(".saldo-dinamico");
  somaTotal.textContent = `${saldoTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;

  if (saldoTotal >= 0.1) {
    somaTotal.classList.add("saldo-dinamico-verde");
    somaTotal.classList.remove("saldo-dinamico-vermelho");
  } else if (saldoTotal < 0) {
    somaTotal.classList.add("saldo-dinamico-vermelho");
    somaTotal.classList.remove("saldo-dinamico-verde");
  }
}

atualizarSaldo();

class Transacao {
  constructor(id, descricao, valor, tipo, opcao) {
    this.id = id;
    this.descricao = descricao;
    this.valor = valor;
    this.tipo = tipo;
    this.option = opcao;
  }
}

function gerarIdAleatorio(comprimento) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const caracteresArray = Array.from(caracteres);
  const idArray = new Array(comprimento);

  for (let i = 0; i < comprimento; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteresArray.length);
    idArray[i] = caracteresArray[indiceAleatorio];
  }

  return idArray.join("");
}

function adicionarTransacaoComDescricao() {
  const descricaoInput = document.getElementById("descricao");
  const descricao = descricaoInput.value;
  const valorInput = document.getElementById("valor");
  const valor = parseFloat(valorInput.value);
  const tipoTransacao = document.getElementById("tipo-transacao");
  const categoriaTransacao = document.getElementById("categoria-transacao");

  if (valor < 0) {
    valorInput.value = 0;
    alert("Insira um número válido");
    return;
  }

  if (descricao.trim() === "") {
    alert("Por favor, insira uma descrição.");
    return;
  } else if (isNaN(valor)) {
    alert("Por favor, insira um número válido para o valor.");
    return;
  }

  if (categoriaTransacao.value === "") {
    alert("Por favor, selecione uma categoria.");
    return;
  }

  if (tipoTransacao.value === "") {
    alert("Por favor, selecione o tipo de transação (entrada ou saída).");
    return;
  }

  const transacao = new Transacao(
    gerarIdAleatorio(12),
    descricao,
    valor,
    tipoTransacao.value,
    categoriaTransacao.value
  );
  transacoes.push(transacao);
  dataMeses[chaves[contador]].push(transacao);

  descricaoInput.value = "";
  valorInput.value = "";
  categoriaTransacao.value = "";
  tipoTransacao.value = "";

  ordenarTransacoes(dataMeses[chaves[contador]]);
  atualizarSaldo();
  exibirTransacoes();

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  localStorage.setItem("transacoesData", JSON.stringify(dataMeses));
}

function exibirTransacoes() {
  const infoTransacoes = document.querySelector(".gasto-detalhado");
  infoTransacoes.innerHTML = "";

  const ul = document.createElement("ul");
  ul.classList.add("vitrine");
  ul.innerHTML = "";

  const divEmpty = document.createElement("div");
  const contentEmpty = document.createElement("span");
  contentEmpty.textContent =
    "Você ainda não possui nenhum lançamento no mês de " + chaves[contador];
  contentEmpty.classList.add("contentEmpty");
  const imgEmpty = document.createElement("img");
  imgEmpty.src =
    "https://cdn.discordapp.com/attachments/1136745071404924938/1171901768955875458/nothingInTracker.png?ex=655e5d92&is=654be892&hm=f513376bd5139fbe8a97f8af935c9c20b891e50210a57bbc1eeae734647f4758&";
  imgEmpty.alt = "Tracker Vazio";
  imgEmpty.style.height = "100px";
  imgEmpty.style.marginBottom = "25px";

  const imgEmptyT = document.createElement("img");
  imgEmptyT.src =
    "https://cdn.discordapp.com/attachments/1136745071404924938/1171901768955875458/nothingInTracker.png?ex=655e5d92&is=654be892&hm=f513376bd5139fbe8a97f8af935c9c20b891e50210a57bbc1eeae734647f4758&";
  imgEmptyT.alt = "Tracker Vazio";
  imgEmptyT.style.height = "100px";

  divEmpty.classList.add("divEmpty");
  divEmpty.appendChild(contentEmpty);
  divEmpty.appendChild(imgEmpty);
  divEmpty.appendChild(imgEmptyT);

  if (!dataMeses[chaves[contador]].length) {
    ul.appendChild(divEmpty);
  }

  dataMeses[chaves[contador]].forEach((transacao, index) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("botao-excluir");

    deleteButton.onclick = function () {
      deletarTransacao(transacao.id, index);
    };

    const content = document.createElement("span");

    content.classList.add('text-transaction')
    
    content.textContent = `${transacao.option.replace(/-/g, " ")} - ${
      transacao.descricao
    }, ${transacao.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    const iconeFlecha = document.createElement("span");
    iconeFlecha.textContent = "";
    iconeFlecha.classList.add("arrow");

    const iconesDisplay = document.createElement("div");
    iconesDisplay.classList.add("div-icones");

    iconesDisplay.appendChild(iconeFlecha);
    iconesDisplay.appendChild(content);
    li.appendChild(iconesDisplay);
    li.appendChild(deleteButton);
    ul.appendChild(li);

    changeBackgroundColor(iconeFlecha, transacao.option);

    if (transacao.tipo === "entrada") {
      li.classList.add("gasto-detalhado-entrada");
      li.classList.remove("gasto-detalhado-saida");
    } else {
      li.classList.add("gasto-detalhado-saida");
      li.classList.remove("gasto-detalhado-entrada");
    }
  });
  infoTransacoes.appendChild(ul);
  ordenarTransacoes(dataMeses[chaves[contador]]);
}

exibirTransacoes();

function changeBackgroundColor(lista, categoria) {
  if (categoria === "Salário") {
    lista.style.borderBottom = `12px solid #ffcc00`;
  } else if (categoria === "Entrada-extra") {
    lista.style.borderBottom = `12px solid #99ccff`;
  } else if (categoria === "Fatura-Kenzie") {
    lista.style.borderBottom = `12px solid #ff9999`;
  } else if (categoria === "Fatura-externa") {
    lista.style.borderBottom = `12px solid #66cc99`;
  } else if (categoria === "Fatura-interna-(PF)") {
    lista.style.borderBottom = `12px solid #ff66cc`;
  } else if (categoria === "Fatura-interna-(PJ)") {
    lista.style.borderBottom = `12px solid #9966cc`;
  } else if (categoria === "Gastos-extras") {
    lista.style.borderBottom = `12px solid #cc9966`;
  }
}

const alterarMes1 = document.querySelector(".display-mes");
alterarMes1.innerText = chaves[contador];

function passarMes() {
  const alterarMes = document.querySelector(".display-mes");
  if (contador < 11) {
    contador++;
    localStorage.setItem("contador", JSON.stringify(contador));
    alterarMes.innerText = chaves[contador];
    exibirTransacoes();
  }
}

const btnPassarMes = document.querySelector(".btn-alterar-mes");
btnPassarMes.addEventListener("click", passarMes);

function voltarMes() {
  const alterarMes = document.querySelector(".display-mes");
  if (contador > 0) {
    contador--;
    localStorage.setItem("contador", JSON.stringify(contador));
    alterarMes.innerText = chaves[contador];
    exibirTransacoes();
  }
}

const btnVoltarMes = document.querySelector(".btn-voltar-mes");
btnVoltarMes.addEventListener("click", voltarMes);

// Delete
function deletarTransacao(identidadeTransacao, indexMes) {
  dataMeses[chaves[contador]].splice(indexMes, 1);

  const indiceTransacao = transacoes.findIndex(
    (objeto) => objeto.id === identidadeTransacao
  );

  if (indiceTransacao !== -1) {
    transacoes.splice(indiceTransacao, 1);
  }

  exibirTransacoes();
  atualizarSaldo();

  localStorage.setItem("transacoesData", JSON.stringify(dataMeses));
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Gráficos
const ctx = document.getElementById("grafico-dinamico");

const cores = ["#ffcc00", "#99ccff", "#ff9999", "#66cc99", "#ff66cc", "#9966cc", "#cc9966"];

const data = {
  labels: [
    "Salário",
    "Entrada extra",
    "Fatura Kenzie",
    "Fatura Externa",
    "Fatura Interna (PF)",
    "Fatura Interna (PJ)",
    "Gastos extra",
  ],
  datasets: [
    {
      label: " ",
      data: [22, 18, 12, 5, 11, 2, 3],
      borderWidth: 4,
      backgroundColor: cores,
    },
  ],
};

const config = {
  type: "pie",
  data: data,
  options: {
    plugins: {
      legend: {
        position: "right",
      },
      }
    }
 
};

new Chart(ctx, config);

// let indiceGrafico = 0;

// const graficos = [];

// const ctx = document.getElementById("grafico-dinamico").getContext("2d");

// function exibirGrafico(indice) {
//   const graficoAtual = graficos[indice];
//   new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: graficoAtual.labels,
//       datasets: [
//         {
//           label: graficoAtual.label,
//           data: graficoAtual.data,
//         },
//       ],
//     },
// //   });
// }

// function voltarGrafico() {
//   if (indiceGrafico > 0) {
//     indiceGrafico--;
//     atualizarGrafico();
//   }
// }

// function passarGrafico() {
//   if (indiceGrafico < graficos.length - 1) {
//     indiceGrafico++;
//     atualizarGrafico();
//   }
// }

// function atualizarGrafico() {
//   if (Chart.instances.length > 0) {
//     Chart.instances[0].destroy();
//   }
//   exibirGrafico(indiceGrafico);
// }

// exibirGrafico(indiceGrafico);

// const btnVoltarGrafico = document.querySelector(".btn-voltar-grafico");
// btnVoltarGrafico.addEventListener("click", voltarGrafico);

// const btnAlterarGrafico = document.querySelector(".btn-alterar-grafico");
// btnAlterarGrafico.addEventListener("click", passarGrafico);
