using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MyAngularApp.Domain
{
    public class Customer
    {
        [Key()]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
