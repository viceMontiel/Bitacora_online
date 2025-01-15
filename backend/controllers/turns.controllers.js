import { TurnModel } from '../models/turns.model.js';

export const getTurns = async (req, res) => {
  try {
    const turns = await TurnModel.getTurns();
    res.json(turns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getEventsByTurn = async (req, res) => {
  const { usuario } = req.query;
  const { turno } = req.params;

  if (!usuario || !turno) {
    return res.status(400).json({ message: 'Parámetros faltantes: usuario o turno' });
  }

  try {
    const events = await TurnModel.getEventsByTurn(turno, usuario);
    res.json({ total: events.length, eventos: events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Error del servidor' });
  }
};
