import { Request, Response } from 'express'

export const addFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.file)
  return res.status(200).json({
    status: 'success',
    message: 'File uploaded successfully'
  })
}
