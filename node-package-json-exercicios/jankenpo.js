const usuario = process.argv[2].toLowerCase();

const possibilidades = ['pedra', 'papel', 'tesoura'];

function geradorIndice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const computador = possibilidades[geradorIndice(0,2)];

if((usuario == 'pedra' && computador == 'pedra') || (usuario == 'papel' && computador == 'papel') || (usuario == 'tesoura' && computador == 'tesoura')){console.log(`Você escolheu: ${usuario} \nComputador escolheu: ${computador} \n${usuario.toUpperCase()} x ${computador.toUpperCase()} = Empate`)}
if((usuario == 'pedra' && computador == 'tesoura') || (usuario == 'tesoura' && computador == 'papel') || (usuario == 'papel' && computador == 'pedra')){console.log(`Você escolheu: ${usuario} \nComputador escolheu: ${computador} \n${usuario.toUpperCase()} x ${computador.toUpperCase()} = Vitória usuário`)}
if((usuario == 'pedra' && computador == 'papel') || (usuario == 'papel' && computador == 'tesoura') || (usuario == 'tesoura' && computador == 'pedra')){console.log(`Você escolheu: ${usuario} \nComputador escolheu: ${computador} \n${usuario.toUpperCase()} x ${computador.toUpperCase()} = Vitória computador`)}
