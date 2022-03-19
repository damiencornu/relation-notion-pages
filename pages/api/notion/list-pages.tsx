import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })  
  console.log('session value on server API call is', session)
}