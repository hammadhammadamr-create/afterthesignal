namespace NasaSpaceAppsAi.Models
{
    public enum TypesOfUser { Child, Adult }

    public class Users
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        private int _age;
        public int Age
        {
            get { return _age; }
            set
            {
                _age = value;
                if (_age > 18)
                {
                    UserType = TypesOfUser.Adult;
                }
                else
                {
                    UserType = TypesOfUser.Child;
                }
            }
        }

        public TypesOfUser UserType { get; set; }

        public Users()
        {
        }
    }
}