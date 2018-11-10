using System;
using System.ComponentModel.DataAnnotations;

namespace MyAngularApp.Domain
{
    public class Order
    {
        public Order() { }
        [Key()]
        public int Id { get; set; }
        public Customer Customer { get; set; }
        public string Street { get; set; }
        public City City { get; set; }
        public string Location { get; set; }
        public DateTime DatePlaced { get; set; }
        public Operation Operation { get; set; }
        public string Notes { get; set; }
        public Status Status { get; set; }
    }

    public enum Status { Received, enRoute, Cancelled, Completed}
}
