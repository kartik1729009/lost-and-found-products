import { Request, Response } from 'express';
export declare const getFoundItems: (req: Request, res: Response) => Promise<void>;
export declare const getAllComplaints: (req: Request, res: Response) => Promise<void>;
export declare const getComplaintById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateComplaintStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markFoundItemReturned: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=getcontroller.d.ts.map