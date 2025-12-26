using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class AddUserByExcel
    {

        [Required, StringLength(150, MinimumLength = 2)]
        public string FullName { get; set; }

        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^\+[1-9]\d{7,14}$", ErrorMessage = "Phone must start with + and country code.")]
        [StringLength(32)]
        public string PhoneNumber { get; set; }

        [Required, StringLength(100)]
        public string City { get; set; }

        [Required, StringLength(100)]
        public string Country { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DOB { get; set; }
    }
}
