"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOnetData = fetchOnetData;
async function fetchOnetData(req, res) {
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
        const responses = await Promise.all(endpoints.map(endpoint => fetch(`${baseUrl}${endpoint}`, { headers }).then(async (response) => {
            if (!response.ok) {
                if (response.status === 422) {
                    const errorData = await response.json();
                    console.error('Error data:', errorData);
                    const errorMessage = errorData.message || 'No message provided';
                    console.warn(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
                    return null;
                }
                console.warn(`HTTP error! status: ${response.status}`);
                return null;
            }
            return response.json();
        }))).then(results => results.filter(result => result !== null));
        const [basicInfo, knowledge, skills, abilities, personality, technology, education, jobOutlook] = responses;
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
    }
    catch (error) {
        console.error('Error fetching career data:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from onet",
            error: error.message
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZWVycy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY2FyZWVycy5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0Esc0NBNEVDO0FBNUVNLEtBQUssVUFBVSxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDM0QsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDdkMsTUFBTSxPQUFPLEdBQUcsa0RBQWtELFVBQVUsRUFBRSxDQUFDO0lBQy9FLE1BQU0sU0FBUyxHQUFHO1FBQ2QsRUFBRTtRQUNGLFlBQVk7UUFDWixTQUFTO1FBQ1QsWUFBWTtRQUNaLGNBQWM7UUFDZCxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7S0FDakIsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHO1FBQ1osZUFBZSxFQUFFLHdCQUF3QjtRQUN6QyxRQUFRLEVBQUUsa0JBQWtCO0tBQy9CLENBQUM7SUFFRixJQUFJLENBQUM7UUFDRCxNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQy9CLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDckIsS0FBSyxDQUFDLEdBQUcsT0FBTyxHQUFHLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3hDLE1BQU0sWUFBWSxHQUFJLFNBQWtDLENBQUMsT0FBTyxJQUFJLHFCQUFxQixDQUFDO29CQUMxRixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixRQUFRLENBQUMsTUFBTSxjQUFjLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQ2pGLE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLElBQUksQ0FBQztZQUNoQixDQUFDO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUEwQixDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUNMLENBQ0osQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFN0QsTUFBTSxDQUNGLFNBQVMsRUFDVCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsVUFBVSxFQUNWLFNBQVMsRUFDVCxVQUFVLENBQ2IsR0FBRyxTQUFTLENBQUM7UUFFZCxNQUFNLFlBQVksR0FBRztZQUNqQixHQUFHLFNBQVM7WUFDWixTQUFTO1lBQ1QsTUFBTTtZQUNOLFNBQVM7WUFDVCxXQUFXO1lBQ1gsVUFBVTtZQUNWLFNBQVM7WUFDVCxVQUFVO1NBQ2IsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFN0MsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLHFDQUFxQztZQUM5QyxJQUFJLEVBQUUsWUFBWTtTQUNyQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsZ0NBQWdDO1lBQ3pDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7SUFDUCxDQUFDO0FBQ0wsQ0FBQyJ9