// Seleção dos elementos do formulário
const form = document.getElementById('formEndereco');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const ufInput = document.getElementById('uf');
const numeroInput = document.getElementById('numero');
const complementoInput = document.getElementById('complemento');
const loadingCep = document.getElementById('loadingCep');
const erroCep = document.getElementById('erroCep');

// Máscara automática para CEP usando regex com grupos de captura
cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    
    // Aplica máscara com regex e grupos de captura: 00000-000
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    
    e.target.value = valor;
    
    // Limpa mensagem de erro ao digitar
    erroCep.textContent = '';
});

// Converte UF para maiúsculo automaticamente
ufInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Permite apenas dígitos no campo Número
numeroInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Função para buscar CEP na API ViaCEP
async function buscarCEP(cep) {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
        erroCep.textContent = 'CEP deve conter 8 dígitos.';
        return;
    }
    
    // Mostra indicador de carregamento
    loadingCep.innerHTML = '<div class="loading"></div>';
    erroCep.textContent = '';
    
    try {
        // Faz a requisição para a API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        // Remove indicador de carregamento
        loadingCep.innerHTML = '';
        
        // Verifica se o CEP foi encontrado
        if (data.erro) {
            erroCep.textContent = 'CEP não encontrado. Verifique e tente novamente.';
            limparCamposEndereco();
            return;
        }
        
        // Preenche os campos automaticamente
        logradouroInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        ufInput.value = data.uf || '';
        
        // Foca no campo número após preencher
        numeroInput.focus();
        
    } catch (error) {
        // Remove indicador de carregamento
        loadingCep.innerHTML = '';
        erroCep.textContent = 'Erro ao buscar CEP. Verifique sua conexão e tente novamente.';
        console.error('Erro na requisição:', error);
    }
}

// Função para limpar campos de endereço
function limparCamposEndereco() {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    ufInput.value = '';
}

// Evento blur (ao sair do campo CEP)
cepInput.addEventListener('blur', () => {
    const cep = cepInput.value;
    if (cep) {
        buscarCEP(cep);
    }
});

// Também permite buscar pressionando Enter no campo CEP
cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarCEP(cepInput.value);
    }
});

// Validação do formulário no submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validação do CEP
    const cepRegex = /^(\d{5})-(\d{3})$/;
    if (!cepRegex.test(cepInput.value)) {
        alert('CEP inválido! Use o formato 00000-000.');
        isValid = false;
        return;
    }
    
    // Validação do Logradouro
    if (logradouroInput.value.trim().length < 3) {
        alert('Logradouro deve ter no mínimo 3 caracteres.');
        isValid = false;
        return;
    }
    
    // Validação do Bairro
    if (bairroInput.value.trim().length < 3) {
        alert('Bairro deve ter no mínimo 3 caracteres.');
        isValid = false;
        return;
    }
    
    // Validação da Cidade
    if (cidadeInput.value.trim().length < 3) {
        alert('Cidade deve ter no mínimo 3 caracteres.');
        isValid = false;
        return;
    }
    
    // Validação do Número
    if (numeroInput.value.trim() === '' || !/^\d+$/.test(numeroInput.value)) {
        alert('Número inválido! Apenas dígitos são permitidos.');
        isValid = false;
        return;
    }
    
    // Validação da UF - somente 2 letras maiúsculas
    const ufRegex = /^[A-Z]{2}$/;
    if (!ufRegex.test(ufInput.value)) {
        alert('UF inválida! Use apenas 2 letras maiúsculas (exemplo: SP, RJ, MG).');
        isValid = false;
        return;
    }
    
    // Se todas as validações passaram
    if (isValid) {
        // Exibe os dados cadastrados
        const dadosCadastro = {
            cep: cepInput.value,
            logradouro: logradouroInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value,
            numero: numeroInput.value,
            complemento: complementoInput.value
        };
        
        console.log('Dados cadastrados:', dadosCadastro);
        alert('Endereço cadastrado com sucesso!');
        form.reset();
    }
});