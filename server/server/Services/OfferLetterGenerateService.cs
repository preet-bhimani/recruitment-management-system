using Microsoft.EntityFrameworkCore;
using SelectPdf;
using server.Data;
using server.Models.Dto;

namespace server.Services
{
    public class OfferLetterGenerateService
    {
        private readonly AppDbContext dbContext;
        private readonly OfferLetterTemplateService templateService;

        public OfferLetterGenerateService(AppDbContext dbContext, OfferLetterTemplateService templateService)
        {
            this.dbContext = dbContext;
            this.templateService = templateService;
        }

        // Convert form to PDF
        public async Task<string> GenerateOfferLetter(GenerateOfferLetter dto)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
            var job = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == dto.JOId);

            if (user == null || job == null)
            {
                throw new Exception("Invalid user or job details.");
            }

            string htmlContent;

            if (dto.TemplateType == "Internship")
            {
                htmlContent = templateService.InternshipOfferLetterTemplate(
                    companyName: "XYZ Pvt Ltd",
                    fullName: user.FullName,
                    city: user.City,
                    title: job.Title,
                    joiningDate: dto.JoiningDate.ToString("dd MMM yyyy"),
                    endDate: dto.EndDate?.ToString("dd MMM yyyy") ?? "N/A",
                    bondTime: dto.BondTime,
                    salary: dto.Salary.ToString("N2")
                );
            }
            else
            {
                htmlContent = templateService.JobOfferLetterTemplate(
                    companyName: "XYZ Pvt Ltd",
                    fullName: user.FullName,
                    city: user.City,
                    title: job.Title,
                    joiningDate: dto.JoiningDate.ToString("dd MMM yyyy"),
                    bondTime: dto.BondTime,
                    salary: dto.Salary.ToString("N2")
                );
            }
            
            // Upload OfferLetter on local storage
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_OfferLetters");
            Directory.CreateDirectory(uploads);

            var storedFileName = $"{Guid.NewGuid():N}-OfferLetter.pdf";
            var fullPath = Path.Combine(uploads, storedFileName);

            // Generate PDF using SelectPdf
            var converter = new HtmlToPdf();
            var doc = converter.ConvertHtmlString(htmlContent);
            doc.Save(fullPath);
            doc.Close();

            return storedFileName;
        }
    }
}
