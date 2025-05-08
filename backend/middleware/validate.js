export const Validazione = (req, res, next) => {
    const { utente,A, B, scelta } = req.body;
  
    if (!utente || !A || !B || !scelta) {
      return res.status(400).json({ message: "Dati incompleti." });
    }
  
    next();
};