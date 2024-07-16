using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models
{
    public class LoginViewModel
    {
        //[Required(ErrorMessage = "Kullanıcı adı zorunlu.")]
        public string Username { get; set; }

        //[Required(ErrorMessage = "Şifre zorunlu.")]
        //[DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
