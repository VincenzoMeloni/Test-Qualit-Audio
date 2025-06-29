export const Validazione = (req, res, next) => {
    const { utente,A, B, scelta } = req.body;
  
    if (!utente || !A || !B || !scelta) {
      return res.status(400).json({ message: "Dati incompleti." });
    }
  
    next();
};


export const ValidaForm = (req,res,next) =>{
  const { utente, regioneNascita, regioneResidenza, eta, genere, titoloStudio } = req.body;

  if ( !utente || !regioneNascita || !regioneResidenza || !eta || !genere || !titoloStudio) {
    return res.status(400).json({ message: 'Dati incompleti' });
  }

  next();

}