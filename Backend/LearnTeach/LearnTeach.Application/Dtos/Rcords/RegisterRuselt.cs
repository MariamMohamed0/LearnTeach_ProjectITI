using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.Rcords
{
    public  record RegisterRuselt(bool Success=false, string? message = null,string? Token=null,string? Refreshtoken=null);

}
