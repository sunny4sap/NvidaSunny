using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Write(s());
        
    }

    public string s()
    {
        return "{ firstName: 'Tommy',   lastName: 'Maintz'  }";
    }

    public string Country()
    {
        List<string> s1 = new List<string>();
        s1.Add("India");
        s1.Add("Nepal");
        s1.Add("Germany");
        s1.Add("France");
        s1.Add("Japan");
        s1.Add("America");
        s1.Add("Malasyia");

        

        return "k";
    }
}
