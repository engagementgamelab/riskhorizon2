
@NotConverted
@NotRenamed
static class MD5Wrapper{

@NotRenamed
function Md5Sum(strToEncrypt: String) : String
{
	var encoding : System.Text.UTF8Encoding = new System.Text.UTF8Encoding();
	var bytes : byte [] = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 : System.Security.Cryptography.MD5CryptoServiceProvider = new System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes : byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString : String = "";
 
	for (var i : int = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}
}


