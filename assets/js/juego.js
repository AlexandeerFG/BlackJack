const miModulo = (() => { //-- funcion anónima autoinvocada o Pátron módulo
    'use strict';

    let deck         = [];                   //-- baraja
    const tipos      = ['C', 'D', 'H', 'S'], //-- todos los tipos de cartas
          especiales = ['A', 'J', 'Q', 'K']; //-- tipos de cartas especiales

    let puntosJugadores = [];

    // Referencias HTML

    const btnPedir             = document.querySelector('#btnPedir'),
          btnDetener           = document.querySelector('#btnDetener'),
          btnNuevo             = document.querySelector('#btnNuevo'),
          puntosHTML           = document.querySelectorAll('small'), //-- constante que guarda los valores de las etiquetas <small>
          divCartasJugadores   = document.querySelectorAll('.divCartas');

    //-- funcion para inicializar el juego
    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled   = false;
        btnDetener.disabled = false;

    }

    const crearDeck = () => {
        
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for( let tipo of tipos){  //-- se ejecutara por cada uno de los tipos de cartas
                deck.push( i + tipo);
            }
        }

        for ( let tipo of tipos ){
            for( let esp of especiales ){
                deck.push( esp + tipo);
            }
        }

        return _.shuffle( deck );
    }


    //-- funcion para tomar una carta
    const pedirCarta = () => {

        if( deck.length === 0){
            throw 'No hay cartas en el deck'
        }
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN ( valor ) ) ? 
                ( valor === 'A' ) ? 11 : 10 //-- en caso de que sea una letra de la baraja
                : valor * 1;  //-- si es un número se multiplica por uno para transformarlo a su versión númerica

    }


    //-- Turno 0 = primer jugador y el último sera la computadora
    const acumularPuntos = (carta, turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerHTML = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {

    // <img class="carta" src="assets/cartas/2C.png">
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`; //3H, JD
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );

    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;
        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ) {
                alert('Nadie gana :(');
            } else if ( puntosMinimos > 21 ) {
                alert('Computadora gana')
            } else if( puntosComputadora > 21 ) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 100 );
    }

    //-- turno computadora 
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();

            puntosComputadora = acumularPuntos(carta, puntosJugadores.length -1 );
            crearCarta( carta, puntosJugadores.length -1 );

        } while(  (puntosComputadora < puntosMinimos)  && (puntosMinimos <= 21 ) );

        determinarGanador();
    }
    //-- Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if ( puntosJugador > 21 ) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );

        } else if ( puntosJugador === 21 ) {
            console.warn('21, genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;

        turnoComputadora ( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego

    };
})();


