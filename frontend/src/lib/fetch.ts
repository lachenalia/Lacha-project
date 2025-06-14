import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch("http://localhost:3000/sudoku");
  const data = await response.json();
  res.status(200).json(data);
}
