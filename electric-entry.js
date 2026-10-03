// Punto di ingresso del bundle: unisce effetto, libreria ogl e maschera del logo
// in un unico script classico, così funziona anche aprendo index.html con doppio clic.
import mask from './logo-mask.png';
import { createElectricLogo } from './electric-logo.js';

window.ElectricLogo = { createElectricLogo, mask };
