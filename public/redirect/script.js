document.addEventListener('DOMContentLoaded', () => {
    const continueBtn = document.getElementById('continue-btn');
    
    // REEMPLAZA ESTA URL CON TU ENLACE DIRECTO DE ADSTERRA
    const adsterraUrl = "https://instaanon.vercel.app/profile/alinnarosee"; 
    
    continueBtn.addEventListener('click', () => {
        // Redirección inmediata al hacer clic, ideal para arbitraje
        window.location.href = adsterraUrl;
    });
});
