const modalCreateOrEdit = document.getElementById(`modal-create-or-edit`);
const url = `https://firestore.googleapis.com/v1/projects/mistcar-3cec6/databases/(default)/documents/Carros`;
const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const inputCor = document.getElementById('cor');
const inputPlaca = document.getElementById('placa');
const inputAno = document.getElementById('ano');
const inputOdometro = document.getElementById('odometro');
const inputItemId = document.getElementById('item_id');

async function buscarCarros() {
    try {
        // Faz a requisição para a API
        const resposta = await fetch(url);
        const carros = await resposta.json();
        // Seleciona o corpo da tabela
        const tabelaCorpo = document.getElementById("tabelaCarros").querySelector("tbody");

        // Limpa o conteúdo da tabela (caso já tenha alguma linha)
        tabelaCorpo.innerHTML = "";

        // Itera sobre os dados e cria uma nova linha para cada item
        for (let i = 0; i < carros.documents.length; i++) {
            let item = carros.documents[i];
            const linha = document.createElement("tr");
            // Cria e insere células na linha
            linha.innerHTML = `
                <td>${i + 1}</td>
                <td>${item.fields.MARCA.stringValue}</td>
                <td>${item.fields.MODELO.stringValue}</td>
                <td>${item.fields.COR.stringValue}</td>
                <td>${item.fields.PLACA.stringValue}</td>
                <td>${item.fields.ANO.stringValue}</td>
                <td>${item.fields.ODOMETRO.stringValue}</td>
                <td>
                    <button id="itemButtonMenu_${i}" type="button" style="border: none; background: none;">
                        <img width="20" src="../assets/img/menu-aberto.png" alt="">
                    </button>
                    <div id=menu_${i} class="meu-menu">
                        <button id="itemButtonView_${i}" type="button">
                            Visualizar
                        </button>
                        <button id="itemButtonEdit_${i}" type="button">
                            Editar
                        </button>
                        <button id="itemButtonDelete_${i}" type="button">
                            Excluir
                        </button>
                    </div>
                </td>
                `;

            tabelaCorpo.appendChild(linha);

            let menu = document.getElementById(`menu_${i}`)

            let botaoMenu = document.getElementById(`itemButtonMenu_${i}`);
            botaoMenu.addEventListener('click', () => {
                if (!menu.classList.contains('show-menu')) {
                    const ativos = document.querySelectorAll(".show-menu");
                    ativos.forEach(menuAtivo => menuAtivo.classList.remove('show-menu'));

                    menu.classList.add('show-menu');
                }
                else
                    menu.classList.remove('show-menu');
                console.log(menu.classList)
            });

            let botaoView = document.getElementById(`itemButtonView_${i}`);
            botaoView.addEventListener('click', () => {
                visualizarItem(item);
            });

            let botaoEdit = document.getElementById(`itemButtonEdit_${i}`);
            botaoEdit.addEventListener('click', () => {
                editarItem(item);
            });

            let botaoDelete = document.getElementById(`itemButtonDelete_${i}`);
            botaoDelete.addEventListener('click', () => {
                excluirItem(i);
            });
        }

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

buscarCarros();

function criarCarro() {
    clearForm();
    let tituloModal = document.getElementById('tituloModal');
    tituloModal.textContent = "Criando carro";
    modalCreateOrEdit.classList.add('show-modal');
}
function visualizarItem(item) {
    let tituloModal = document.getElementById('tituloModal');
    tituloModal.textContent = "Visualizando carro";
    modalCreateOrEdit.classList.add('show-modal');
    fillForm(item, true)
}

function editarItem(item) {
    let tituloModal = document.getElementById('tituloModal');
    tituloModal.textContent = "Editando carro";
    modalCreateOrEdit.classList.add('show-modal');

    fillForm(item)
}

function excluirItem(index) {
    alert('Excluir')
}

function fillForm(item, isView) {
    let fields = item.fields;
    inputItemId.value = item.name.split(`/`)[item.name.split(`/`).length - 1];

    inputMarca.value = fields.MARCA.stringValue;
    inputMarca.disabled = isView;

    inputModelo.value = fields.MODELO.stringValue;
    inputModelo.disabled = isView;

    inputCor.value = fields.COR.stringValue;
    inputCor.disabled = isView;

    inputPlaca.value = fields.PLACA.stringValue;
    inputPlaca.disabled = isView;

    inputAno.value = fields.ANO.stringValue;
    inputAno.disabled = isView;

    inputOdometro.value = fields.ODOMETRO.stringValue;
    inputOdometro.disabled = isView;
}

function clearForm() {
    inputItemId.value = ``;
    inputMarca.value = ``;
    inputModelo.value = ``;
    inputCor.value = ``;
    inputPlaca.value = ``;
    inputAno.value = ``;
    inputOdometro.value = ``;
}

function cancelar() {
    clearForm();
    closeModal();
}

function salvar() {
    if (!dadosSaoValidos()) {
        alert(`Por favor, preencha os dados corretamente!`);
        return;
    }

    if (isNotEmpty(inputItemId.value))
        update();
    else
        create();
}

function create() {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            fields: {
                MARCA: { stringValue: inputMarca.value },
                MODELO: { stringValue: inputModelo.value },
                COR: { stringValue: inputCor.value },
                PLACA: { stringValue: inputPlaca.value },
                ANO: { stringValue: inputAno.value },
                ODOMETRO: { stringValue: inputOdometro.value },
            }
        })
    })
        .then((response) => response.json)
        .then(() => {
            alert(`Carro criado com sucesso!`);
        })
        .then(() => {

            closeModal();
            buscarCarros();
        })
        .catch((error) => console.error(error))
}

function update() {
    fetch(url + '/' + inputItemId.value, {
        method: 'PATCH',
        body: JSON.stringify({
            fields: {
                MARCA: { stringValue: inputMarca.value },
                MODELO: { stringValue: inputModelo.value },
                COR: { stringValue: inputCor.value },
                PLACA: { stringValue: inputPlaca.value },
                ANO: { stringValue: inputAno.value },
                ODOMETRO: { stringValue: inputOdometro.value },
            }
        })
    })
        .then((response) => response.json)
        .then(() => {
            alert(`Carro atualizado com sucesso!`);
        })
        .then(() => {

            closeModal();
            buscarCarros();
        })
        .catch((error) => console.error(error))
}

function dadosSaoValidos() {
    return isNotEmpty(inputAno.value) &&
        isNotEmpty(inputMarca.value) &&
        isNotEmpty(inputModelo.value) &&
        isNotEmpty(inputOdometro.value) &&
        isNotEmpty(inputPlaca.value) &&
        isNotEmpty(inputCor.value);
}

function isNotEmpty(input) {
    return input != ``;
}

function closeModal() {
    modalCreateOrEdit.classList.remove('show-modal')
}