const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const btnFavoritos = document.getElementById('btn-favoritos');
const btnVoltarHome = document.getElementById('btn-voltar-home');
const mensagemValidacao = document.getElementById('mensagem-validacao');

const secaoResultados = document.getElementById('secao-resultados');
const listaResultados = document.getElementById('lista-resultados');
const secaoFavoritos = document.getElementById('secao-favoritos');
const listaFavoritos = document.getElementById('lista-favoritos');
const containerTextImg = document.querySelector('.container-TextImg'); 


function esconderTudo() {
    containerTextImg.style.display = 'none';
    secaoResultados.style.display = 'none';
    secaoFavoritos.style.display = 'none';
    mensagemValidacao.textContent = '';
}

btnBuscar.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim();

    if (termoBusca.length < 3) {
        mensagemValidacao.textContent = "Por favor, digite pelo menos 3 caracteres para buscar.";
        return;
    }
    
    mensagemValidacao.textContent = "Buscando...";
    
    const urlAPI = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(termoBusca)}`;
    
    fetch(urlAPI)
        .then(response => response.json())
        .then(data => {
            esconderTudo();
            mensagemValidacao.textContent = "";
            secaoResultados.style.display = 'block';
            renderizarResultados(data);
        })
        .catch(error => {
            mensagemValidacao.textContent = "Erro ao buscar dados da API.";
            console.error(error);
        });
});

function renderizarResultados(locais) {
    listaResultados.innerHTML = ''; 

    if (locais.length === 0) {
        listaResultados.innerHTML = '<p>Nenhum local encontrado.</p>';
        return;
    }

    locais.forEach(local => {
        const card = document.createElement('div');
        card.classList.add('card-resultado'); 
        
        const titulo = document.createElement('h3');
        titulo.textContent = local.display_name.split(',')[0]; 
        
        const enderecoCompleto = document.createElement('p');
        enderecoCompleto.textContent = local.display_name;

        const btnSalvar = document.createElement('button');
        btnSalvar.textContent = '⭐ Salvar Favorito';
        btnSalvar.classList.add('btn-salvar'); 
        
        btnSalvar.onclick = () => salvarFavorito(local);

        card.appendChild(titulo);
        card.appendChild(enderecoCompleto);
        card.appendChild(btnSalvar);
        listaResultados.appendChild(card);
    });
}

function renderizarFavoritos() {
    listaFavoritos.innerHTML = '';
    const favoritos = JSON.parse(localStorage.getItem('theBestFavoritos')) || [];

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = '<p>Você ainda não tem lojas favoritas.</p>';
        return;
    }

    favoritos.forEach(fav => {
        const card = document.createElement('div');
        card.classList.add('card-favorito'); 
        
        const titulo = document.createElement('h3');
        titulo.textContent = fav.nome;
        
        const endereco = document.createElement('p');
        endereco.textContent = fav.endereco;

        card.appendChild(titulo);
        card.appendChild(endereco);
        listaFavoritos.appendChild(card);
    });
}


function salvarFavorito(local) {
   
    let favoritos = JSON.parse(localStorage.getItem('theBestFavoritos')) || [];
    
 
    const jaExiste = favoritos.find(fav => fav.place_id === local.place_id);
    if (!jaExiste) {
        favoritos.push({
            place_id: local.place_id,
            nome: local.display_name.split(',')[0],
            endereco: local.display_name
        });
        localStorage.setItem('theBestFavoritos', JSON.stringify(favoritos));
        alert('Loja favoritada com sucesso!');
    } else {
        alert('Esta localização já está nos seus favoritos.');
    }
}


btnFavoritos.addEventListener('click', () => {
    esconderTudo();
    secaoFavoritos.style.display = 'block';
    renderizarFavoritos();
});

function renderizarFavoritos() {
    listaFavoritos.innerHTML = '';
    const favoritos = JSON.parse(localStorage.getItem('theBestFavoritos')) || [];

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = '<p>Você ainda não tem lojas favoritas.</p>';
        return;
    }

    favoritos.forEach(fav => {
        const card = document.createElement('div');
        card.style = 'border: 2px solid #007131; padding: 15px; border-radius: 16px; width: 300px; text-align: left;';
        
        const titulo = document.createElement('h3');
        titulo.textContent = fav.nome;
        titulo.style.color = '#f4a000';
        
        const endereco = document.createElement('p');
        endereco.textContent = fav.endereco;
        endereco.style.fontSize = '14px';

        card.appendChild(titulo);
        card.appendChild(endereco);
        listaFavoritos.appendChild(card);
    });
}


btnVoltarHome.addEventListener('click', () => {
    esconderTudo();
    containerTextImg.style.display = 'block';
    inputBusca.value = '';
});