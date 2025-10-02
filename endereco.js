// Seleção dos elementos do formulário
const form = document.getElementById('formEndereco');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const numeroInput = document.getElementById('numero');
const ufInput = document.getElementById('uf');
const complementoInput = document.getElementById('complemento');

// Máscara automática para CEP usando regex com grupos de captura
cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    
    // Aplica máscara com regex e grupos de captura: 00000-000
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    
    e.target.value = valor;
});

// Converte UF para maiúsculo automaticamente
ufInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Permite apenas dígitos no campo Número
numeroInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
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
    if (logradouroInput.value.trim().length < 5) {
        alert('Logradouro deve ter no mínimo 5 caracteres.');
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
        alert('Endereço cadastrado com sucesso!');
        form.reset();
    }
});