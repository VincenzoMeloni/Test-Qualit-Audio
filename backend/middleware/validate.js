export const Validazione = (req, res, next) => {
    const { A, B, scelta } = req.body;
  
    if (!A || !B || !scelta) {
      return res.status(400).json({ message: "Dati incompleti." });
    }
  
    next();
  };