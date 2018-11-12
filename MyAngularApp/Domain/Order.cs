using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyAngularApp.Domain
{
    public class Order
    {
        public Order() { }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key()]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public string Street { get; set; }
        public int CityId { get; set; }
        public City City { get; set; }
        public string Location { get; set; }
        public DateTime DateReceived { get; set; }
        public int OperationId { get; set; }
        public Operation Operation { get; set; }
        public string Notes { get; set; }
        public Status Status { get; set; }
        public DateTime DateScheduled { get; set; }
        public DateTime DateEnRoute { get; set; }
        public DateTime DateCancelled { get; set; }
        public DateTime DateCompleted { get; set; }
        public string InstallerComments { get; set; }
        public string Asset { get; set; }
    }

    public enum Status { Received, Scheduled, enRoute, Cancelled, Completed}
}
