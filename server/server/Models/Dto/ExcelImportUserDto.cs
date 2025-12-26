namespace server.Models.Dto
{
    public class ExcelImportUserDto
    {
        public int TotalRows { get; set; }
        public int Inserted { get; set; }
        public List<ExcelImportUserErrorDto> Errors { get; set; } = new();
    }

    public class ExcelImportUserErrorDto
    {
        public int Row { get; set; }
        public string Email { get; set; }
        public string Reason { get; set; }
    }
}
