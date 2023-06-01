let inputNovaTarefa = document.querySelector('#inputNovaTarefa');
let btnAddTarefa = document.querySelector('#btnAddTarefa');
let listaTarefas = document.querySelector('#listaTarefas');
let janelaEdicao = document.querySelector('#janelaEdicao');
let janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo');
let janelaEdicaoBtnFechar = document.querySelector('#janelaEdicaoBtnFechar');
let btnAtualizarTarefa = document.querySelector('#btnAtualizarTarefa');
let idTarefaEdicao = document.querySelector('#idTarefaEdicao');
let inputTarefaNomeEdicao = document.querySelector('#inputTarefaNomeEdicao');
const qtdIdsDisponiveis = Number.MAX_VALUE;
const KEY_CODE_ENTER = 13;
const KEY_LOCAL_STORAGE = 'listaDeTarefas';
let dbTarefas = [];

obterTarefasLocalStorage();
renderizarListaTarefaHtml();

inputNovaTarefa.addEventListener('keypress', (e) => {

    if(e.keyCode == KEY_CODE_ENTER) {
        let tarefa = {
            nome: inputNovaTarefa.value,
            id: gerarIdV2(),
        }
        adicionarTarefa(tarefa);
    }
});

janelaEdicaoBtnFechar.addEventListener('click', (e) => {
    alternarJanelaEdicao();
});

btnAddTarefa.addEventListener('click', (e) => {

    let tarefa = {
        nome: inputNovaTarefa.value,
        id: gerarIdV2(),
    }
    adicionarTarefa(tarefa);
});

btnAtualizarTarefa.addEventListener('click', (e) => {
    e.preventDefault();

    let idTarefa = idTarefaEdicao.innerHTML.replace('#', '');

    let tarefa = {
        nome: inputTarefaNomeEdicao.value,
        id: idTarefa
    }

    let tarefaAtual = document.getElementById(''+idTarefa+'');

    if(tarefaAtual) {

        const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
        dbTarefas[indiceTarefa] = tarefa;
        salvarTarefasLocalStorage();

        let li = criarTagLI(tarefa);
        listaTarefas.replaceChild(li, tarefaAtual);
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado!');
    } 
});

function gerarId() {
    return Math.floor(Math.random() * qtdIdsDisponiveis);
}

function gerarIdV2() {
    return gerarIdUnico();
}

function gerarIdUnico() {

    let itensDaLista = document.querySelector('#listaTarefas').children;
    let idsGerados = [];

    for(let i=0;i<itensDaLista.length;i++) {
        idsGerados.push(itensDaLista[i].id);
    }

    let contadorIds = 0;
    let id = gerarId();

    while(contadorIds <= qtdIdsDisponiveis && 
        idsGerados.indexOf(id.toString()) > -1) {
            id = gerarId();
            contadorIds++;

            if(contadorIds >= qtdIdsDisponiveis) {
                alert("Oops, ficamos sem IDS :/");
                throw new Error("Acabou os IDs :/");
            }
        }

    return id;
}

function adicionarTarefa(tarefa) {
    dbTarefas.push(tarefa);
    salvarTarefasLocalStorage(dbTarefas);
    renderizarListaTarefaHtml();
}

function criarTagLI(tarefa) {

    let li = document.createElement('li');
    li.id = tarefa.id;

    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = tarefa.nome;

    let div  = document.createElement('div');

    let btnEditar = document.createElement('button');
    btnEditar.classList.add('btnAcao');
    btnEditar.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEditar.setAttribute('onclick', 'editar('+tarefa.id+')');

    let btnExcluir  = document.createElement('button');
    btnExcluir.classList.add('btnAcao');
    btnExcluir.innerHTML = '<i class="fa fa-trash"></i>';
    btnExcluir.setAttribute('onclick', 'excluir('+tarefa.id+')');

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function editar(idTarefa) {
    let li = document.getElementById(''+ idTarefa + '');
    if(li) {
        idTarefaEdicao.innerHTML = '#' + idTarefa;
        inputTarefaNomeEdicao.value = li.innerText;
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado!');
    }
}

function excluir(idTarefa) {

    let confirmacao = window.confirm('Tem certeza que deseja excluir? ');
    if(confirmacao) {

        const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
        dbTarefas.splice(indiceTarefa, 1);
        salvarTarefasLocalStorage();

        let li = document.getElementById(''+ idTarefa + '');
        if(li) {
            listaTarefas.removeChild(li);
        } else {
            alert('Elemento HTML não encontrado!');
        }
    }
}

function alternarJanelaEdicao() {
    janelaEdicao.classList.toggle('abrir');
    janelaEdicaoFundo.classList.toggle('abrir');
}

function obterIndiceTarefaPorId(idTarefa) {
    const indiceTarefa = dbTarefas.findIndex(t => t.id == idTarefa);
    if(indiceTarefa < 0) {
        throw new Error('Id da tarefa não encontrado: ', idTarefa);
    }
    return indiceTarefa;
}

function renderizarListaTarefaHtml() {
    listaTarefas.innerHTML = '';
    for(let i=0; i < dbTarefas.length; i++) {
        let li = criarTagLI(dbTarefas[i]);
        listaTarefas.appendChild(li); 
    } 
    inputNovaTarefa.value = '';  
}

function salvarTarefasLocalStorage() {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbTarefas));
}

function obterTarefasLocalStorage() {
    if(localStorage.getItem(KEY_LOCAL_STORAGE)) {
        dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
    }  
}