import { Request, Response } from "express";
import prisma from "../db";

interface ApiResponse {
    [key: string]: any;
}

export async function fetchOnetData(req: Request, res: Response) {
    const careerCode = req.params.onetCode;
    const baseUrl = `https://services.onetcenter.org/ws/mnm/careers/${careerCode}`;
    const endpoints = [
        '',
        '/knowledge',
        '/skills',
        '/abilities',
        '/personality',
        '/technology',
        '/education',
        '/job_outlook'
    ];

    const headers = {
        'Authorization': 'Basic ZGI6Mzc1N2Viaw==',
        'Accept': 'application/json'
    };

    try {
        const responses = await Promise.all(
            endpoints.map(endpoint =>
                fetch(`${baseUrl}${endpoint}`, { headers }).then(async (response) => {
                    if (!response.ok) {
                        if (response.status === 422) {
                            const errorData = await response.json();
                            console.error('Error data:', errorData);
                            const errorMessage = (errorData as { message?: string }).message || 'No message provided';
                            console.warn(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
                            return null;
                        }
                        console.warn(`HTTP error! status: ${response.status}`);
                        return null;
                    }
                    return response.json() as Promise<ApiResponse>;
                })
            )
        ).then(results => results.filter(result => result !== null));

        const [
            basicInfo,
            knowledge,
            skills,
            abilities,
            personality,
            technology,
            education,
            jobOutlook
        ] = responses;

        const combinedData = {
            ...basicInfo,
            knowledge,
            skills,
            abilities,
            personality,
            technology,
            education,
            jobOutlook
        };

        console.log("Combined data: ", combinedData);

        res.json({
            success: true,
            message: "Data fetched from onet successfully",
            data: combinedData
        });
    } catch (error) {
        console.error('Error fetching career data:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from onet",
            error: error.message
        });
    }
}