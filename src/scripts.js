const modalCreateOrEdit = document.getElementById(`modal-create-or-edit`);
async function buscarCarros() {
    try {
        // Faz a requisição para a API
        const resposta = await fetch("https://firestore.googleapis.com/v1/projects/mistcar-3cec6/databases/(default)/documents/Carros");
        const carros = await resposta.json();
        // Seleciona o corpo da tabela
        const tabelaCorpo = document.getElementById("tabelaCarros").querySelector("tbody");

        // Limpa o conteúdo da tabela (caso já tenha alguma linha)
        tabelaCorpo.innerHTML = "";

        // Itera sobre os dados e cria uma nova linha para cada item
        for (let i = 0; i < carros.documents.length; i++) {
            let item = carros.documents[i];
            console.log(item)
            // dados.forEach(item => {
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
                if (!menu.classList.contains('show'))
                    menu.classList.add('show');
                else
                    menu.classList.remove('show');
            });

            let botaoView = document.getElementById(`itemButtonView_${i}`);
            botaoView.addEventListener('click', () => {
                visualizarItem(i);
            });

            let botaoEdit = document.getElementById(`itemButtonEdit_${i}`);
            botaoEdit.addEventListener('click', () => {
                editarItem(i);
            });

            let botaoDelete = document.getElementById(`itemButtonDelete_${i}`);
            botaoDelete.addEventListener('click', () => {
                excluirItem();
            });
        }

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

buscarCarros();

function visualizarItem(index) {
    let tituloModal = document.getElementById('tituloModal');
    tituloModal.textContent = "Visualizando carro";
    modalCreateOrEdit.classList.add('show-modal');
}

function editarItem(index) {
    let tituloModal = document.getElementById('tituloModal');
    tituloModal.textContent = "Editando carro";
    modalCreateOrEdit.classList.add('show-modal');
}

function excluirItem(index) {
    alert('Excluir')
}

function cancelar() {
    modalCreateOrEdit.classList.remove('show-modal')
}