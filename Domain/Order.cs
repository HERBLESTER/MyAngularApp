using System;

namespace MyAngularApp.Domain
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Address Address { get; set; }
        public DateTime DatePlaced { get; set; }
        public int OperationId { get; set; }
        public string Notes { get; set; }
    }
}
