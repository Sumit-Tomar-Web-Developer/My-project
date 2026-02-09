import React, { useState } from 'react';
import { Typography, Box, Button, Grid, IconButton } from '@mui/material';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

const TeamCondition = () => {
  const [currentPage, setCurrentPage] = useState(1); // Initial page
  const [fontSize, setFontSize] = useState(13); // Initial font size
  const totalPages = 4; // Total number of pages

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 1, 10)); // Ensure minimum font size is 10
  };

  const downloadTermsAndConditions = () => {
    const termsContent = `
      CMC Terms and Conditions For Online
  
      Terms and Conditions For Online-Payments
      The Terms and Conditions contained herein shall apply to any person (“User”) using the services of
      Chandrapur Municipal Corporation(CMC). for making payments through an online payment gateway service
      (“Service ”) offered by CMC in association with concern Bank and Tech Process (“Payment Service
      Providers ”) through CMC’s website i.e. http://www.chandrapurmc.org. Each User is therefore deemed to
      have read and accepted these Terms and Conditions.
      A. Privacy Policy
      CMC respects and protects the privacy of the individuals that access the information and use the
      services provided through them. Individually identifiable information about the User is not willfully
      disclosed to any third party without first receiving the User's permission, as covered in this Privacy
      Policy.
      This Privacy Policy describes CMC ’s treatment of personally identifiable information that CMC
      collects when the User is on the CMC ’s website. CMC does not collect any unique information
      about the User (such as User's name, email address, age, gender etc.) except when you specifically
      and knowingly provide such information on the Website. Like any business interested in offering the
      highest quality of service to clients, CMC may, from time to time, send email to the User and other
      communication to tell the User about the various services, features, functionality and content
      offered by CMC website or seek voluntary information from The User.
      Please be aware, however, that CMC will release specific personal information about the User if
      required to do so in the following circumstances:
      a) in order to comply with any valid legal process such as a search warrant, statute, or court order, or
      available at time of opening the tender
      b) if any of User’s actions on our website violate the Terms of Service or any of our guidelines for
      specific services, or
      c) To protect or defend CMC ’s legal rights or property, the CMC ’s site, or the Users of the site or;
      d) To investigate, prevent, or take action regarding illegal activities, suspected fraud, situations
      involving potential threats to the security, integrity of CMC ’s website/offerings.
      B. General Terms and Conditions For E-Payment
      
    `;
  
    // Convert the content to a blob
    const termsBlob = new Blob([termsContent], { type: 'text/plain' });
  
    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(termsBlob);
    downloadLink.download = 'Receipt_online_payment.pdf';
    downloadLink.click();
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };


  return (
    <>
      <MainCard>
      <MainCard style={{ backgroundColor: '#e3f2fd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography variant="h3" style={{ fontWeight: 'bold' }}>
    Receipt
  </Typography>
</MainCard>
<MainCard style={{ backgroundColor: 'black', color: 'white' }}>
 <Grid container justifyContent="space-between" alignItems="center" >
          <Grid item>
            <Typography variant="h5" >
              CMC Terms and Conditions For Online - Page {currentPage} of {totalPages}
            </Typography>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end">
  {/* Button with download icon */}
  <IconButton sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }}variant="contained" color="primary" onClick={downloadTermsAndConditions} size="large">
    <DownloadOutlined />
  </IconButton>
  <IconButton  sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} variant="contained" color="primary" size="large">
    <PrinterOutlined />
  </IconButton>
  <Button sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={increaseFontSize}>
  +
</Button>
<Button sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={decreaseFontSize}>
  -
</Button>

  {/* Page navigation buttons */}
  <Button  sx={{ gap: '2vw', fontSize: '1.1rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
  <Button  sx={{ gap: '2vw', fontSize: '1.1rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={nextPage} disabled={currentPage === totalPages} >Next</Button>
</Grid>

          
        </Grid>
        </MainCard>
        <Typography variant="body1" mt={2} style={{ fontSize: `${fontSize}px` }}>
          {currentPage === 1 && (
            <>
    <Typography variant="h5" style={{ fontWeight: 'bold' }}>Terms and Conditions For Online-Payments :</Typography>
              
              The Terms and Conditions contained herein shall apply to any person (“User”) using the services of
Chandrapur Municipal Corporation(CMC). for making payments through an online payment gateway service
(“Service ”) offered by CMC in association with concern Bank and Tech Process (“Payment Service
Providers ”) through CMC’s website i.e. http://www.chandrapurmc.org. Each User is therefore deemed to
have read and accepted these Terms and Conditions.      
         <br />
<Typography variant="h5" style={{ fontWeight: 'bold' }}>A. Privacy Policy :</Typography>
              
              CMC respects and protects the privacy of the individuals that access the information and use the
              services provided through them. Individually identifiable information about the User is not willfully
              disclosed to any third party without first receiving the User's permission, as covered in this Privacy
              Policy.              
                <br />
                This Privacy Policy describes CMC ’s treatment of personally identifiable information that CMC
              collects when the User is on the CMC ’s website. CMC does not collect any unique information
              about the User (such as User's name, email address, age, gender etc.) except when you specifically
              and knowingly provide such information on the Website. Like any business interested in offering the
              highest quality of service to clients, CMC may, from time to time, send email to the User and other
              communication to tell the User about the various services, features, functionality and content
              offered by CMC website or seek voluntary information from The User. 
                            <br />
             Please be aware, however, that CMC will release specific personal information about the User if
              required to do so in the following circumstances:
              <br /> a) in order to comply with any valid legal process such as a search warrant, statute, or court order, or
              available at time of opening the tender
              <br /> b) if any of User’s actions on our website violate the Terms of Service or any of our guidelines for
              specific services, or
              <br />   c) To protect or defend CMC ’s legal rights or property, the CMC ’s site, or the Users of the site or;
              <br /> d) To investigate, prevent, or take action regarding illegal activities, suspected fraud, situations
              involving potential threats to the security, integrity of CMC ’s website/offerings. 
              <br/>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>B. General Terms and Conditions For E-Payment:</Typography>
         1. Once a User has accepted these Terms and Conditions, he/ she may register on CMC’s site and
avail the Services. 
         <br/>
         2. CMC's rights, obligations, undertakings shall be subject to the laws in force in India, as well as any
directives/ procedures of Government of India, and nothing contained in these Terms and
Conditions shall be in derogation of CMC's right to comply with any law enforcement agencies
request or requirements relating to any User’s use of the website or information provided to or
gathered by CMC with respect to such use. Each User accepts and agrees that the provision of
details of his/ her use of the Website to regulators or police or to any other third party in order to
resolve disputes or complaints which relate to the Website shall be at the absolute discretion of
CMC. 
         <br/>
         3. If any part of these Terms and Conditions are determined to be invalid or unenforceable pursuant
to applicable law including, but not limited to, the warranty disclaimers and liability
limitations set forth herein, then the invalid or unenforceable provision will be deemed superseded
by a valid, enforceable provision that most closely matches the intent of the original provision and
the remainder of these Terms and Conditions shall continue in effect
         <br/>
         4. These Terms and Conditions constitute the entire agreement between the User and CMC. These
Terms and Conditions supersede all prior or contemporaneous communications and proposals,
whether electronic, oral, or written, between the User and CMC. A printed version of these Terms
and Conditions and of any notice given in electronic form shall be admissible in judicial or
administrative proceedings based upon or relating to these Terms and Conditions to the same extent
and subject to the same conditions as other business documents and records originally generated
and maintained in printed form. 
         <br/>
            </>
          )}
          {currentPage === 2 && (
            <>
5. The entries in the books of CMC and/or the Payment Service Providers kept in the ordinary course
of business of CMC and/or the Payment Service Providers with regard to transactions covered under
these Terms and Conditions and matters therein appearing shall be binding on the User and shall be
conclusive proof of the genuineness and accuracy of the transaction
<br/>
6. Refund For Charge Back Transaction : In the event there is any claim for/ of charge back by the
User for any reason whatsoever, such User shall immediately approach CMC with his/ her claim
details and claim refund from CMC alone. Such refund (if any) shall be effected only by CMC via
payment gateway or by means of a demand draft or such other means as CMC deems appropriate.
No claims for refund/ charge back shall be made by any User to the Payment Service Provider(s) and
in the event such claim is made it shall not be entertained.
<br/>
7. In these Terms and Conditions, the term “ Charge Back ” shall mean, approved and settled credit
card or net banking purchase transaction(s) which are at any time refused, debited or charged back
to merchant account (and shall also include similar debits to Payment Service Provider's accounts, if
any) by the acquiring bank or credit card company for any reason whatsoever, together with the
bank fees, penalties and other charges incidental thereto. 
<br/>
8. Refund for fraudulent/duplicate transaction(s): The User shall directly contact CMC for any
fraudulent transaction(s) on account of misuse of Card/ Bank details by a fraudulent individual/party
and such issues shall be suitably addressed by CMC alone in line with their policies and rules. 
<br/>
9. Server Slow Down/Session Timeout: In case the Website or Payment Service Provider’s webpage,
that is linked to the Website, is experiencing any server related issues like ‘slow down’ or ‘failure’ or
‘session timeout’, the User shall, before initiating the second payment,, check whether his/her Bank
Account has been debited or not and accordingly resort to one of the following options: 
<br/>
i. In case the Bank Account appears to be debited, ensure that he/ she does not make the payment
twice and immediately thereafter contact CMC via e-mail or any other mode of contact as provided
by CMC to confirm payment. 
<br/>
ii. In case the Bank Account is not debited, the User may initiate a fresh transaction to make
payment. 
<br/>
However, the User agrees that under no circumstances the Payment Gateway Service Provider shall
be held responsible for such fraudulent/duplicate transactions and hence no claims should be
<br/>
Provider(s) in this regard shall be entertained by the Payment Service 
<br/>
Provider(s). 
<Typography variant="h5" style={{ fontWeight: 'bold' }}>C. Limitation of Liability </Typography>

1. CMC has made this Service available to the User as a matter of convenience. CMC expressly
disclaims any claim or liability arising out of the provision of this Service. The User agrees and
acknowledges that he/ she shall be solely responsible for his/ her conduct and that CMC reserves
the right to terminate the rights to use of the Service immediately without giving any prior notice
thereof.
<br/>
2. CMC and/or the Payment Service Providers shall not be liable for any inaccuracy, error or delay in,
or omission of (a) any data, information or message, or (b) the transmission or delivery of any such
data, information or message; or (c) any loss or damage arising from or occasioned by any such
inaccuracy, error, delay or omission, non-performance or interruption in any such data, information
or message. Under no circumstances shall the CMC and/or the Payment Service Providers, its
employees, directors, and its third party agents involved in processing, delivering or managing the
Services, be liable for any direct, indirect, incidental, special or consequential damages, or any
damages whatsoever, including punitive or exemplary arising out of or in any way connected with
the provision of or any inadequacy or deficiency in the provision of the Services or resulting from
unauthorized access or alteration of transmissions of data or arising from suspension or termination
of the Services.
<br/>
3. CMC and the Payment Service Provider(s) assume no liability whatsoever for any monetary or 
           
            </>
          )}
          {currentPage === 3 && (
            <>
other damage suffered by the User on account of: 
<br/>
(I) the delay, failure, interruption, or corruption of any data or other information transmitted in
connection with use of the Payment Gateway or Services in connection thereto; and/ or (ii) any
interruption or errors in the operation of the Payment Gateway. 
<br/>
4. The User shall indemnify and hold harmless the Payment Service Provider(s) and CMC and their
respective officers, directors, agents, and employees, from any claim or demand, or actions arising
out of or in connection with the utilization of the Services.
<br/>
<Typography variant="h5" style={{ fontWeight: 'bold' }}>D. Miscellaneous Conditions: </Typography>
1. Any waiver of any rights available to CMC under these Terms and Conditions shall not mean that
those rights are automatically waived. 
<br/>
2. The User agrees, understands and confirms that his/ her personal data including without
limitation details relating to debit card/ credit card transmitted over the Internet may be susceptible
to misuse, hacking, theft and/ or fraud and that CMC or the Payment Service Provider(s) have no
control over such matters. 
<br/>
3. Although all reasonable care has been taken towards guarding against unauthorized use of any
information transmitted by the User, CMC does not represent or guarantee that the use of the
Services provided by/ through it will not result in theft and/or unauthorized use of data over the
Internet. 
<br/>
4. CMC, the Payment Service Provider(s) and its affiliates and associates shall not be liable, at any
time, for any failure of performance, error, omission, interruption, deletion, defect, delay in
operation or transmission, computer virus, communications line failure, theft or destruction or
unauthorized access to, alteration of, or use of information contained on the Website. 
<br/>
4. CMC, the Payment Service Provider(s) and its affiliates and associates shall not be liable, at any
time, for any failure of performance, error, omission, interruption, deletion, defect, delay in
operation or transmission, computer virus, communications line failure, theft or destruction or
unauthorized access to, alteration of, or use of information contained on the Website. 
<br/>
i. Choose a new password, whenever required for security reasons. ii. Keep his/ her User ID &
Password strictly confidential.iii. Be responsible for any transactions made by User under such User
ID and Password.
<br/>
The User is hereby informed that CMC will never ask the User for the User’s password in an
unsolicited phone call or in an unsolicited email. The User is hereby required to sign out of his/ her
CMC account on the Website and close the web browser window when the transaction(s) have been
completed. This is to ensure that others cannot access the User’s personal information and
correspondence when the User happens to share a computer with someone else or is using a
computer in a public place like a library or Internet café. 
<Typography variant="h5" style={{ fontWeight: 'bold' }}>E. Debit/Credit Card, Bank Account Details </Typography>
1. The User agrees that the debit/credit card details provided by him/ her for use of the aforesaid
Service(s) must be correct and accurate and that the User shall not use a debit/ credit card, that is
not lawfully owned by him/ her or the use of which is not authorized by the lawful owner thereof.
The User further agrees and undertakes to provide correct and valid debit/credit card details. 
<br/>
2. The User may make his/ her payment(Tender Fee/Earnest Money deposit) to CMC by using a
debit/credit card or through online banking account. The User warrants, agrees and confirms that
when he/ she initiates a payment transaction and/or issues an online payment instruction and
provides his/ her card / bank details:
<br/>
i. The User is fully and lawfully entitled to use such credit / debit card, bank account for such transactions; 
<br/>
ii. The User is responsible to ensure that the card/ bank account details provided by him/ her are
accurate; 
<br/>
iii. The User is authorizing debit of the nominated card/ bank account for the payment of Tender Fee
and Earnest Money Deposit.
<br/>

            </>
          )}
          {currentPage === 4 &&(
            <>
            iv. The User is responsible to ensure sufficient credit is available on the nominated card/ bank
account at the time of making the payment to permit the payment of the dues payable or the bill(s)
selected by the User inclusive of the applicable Fee. 
<br/>
F. Personal Information 
<br/>
1. The User agrees that, to the extent required or permitted by law, CMC and/ or the Payment
Service Provider(s) may also collect, use and disclose personal information in connection with
security related or law enforcement investigations or in the course of cooperating with authorities or
complying with legal requirements. 
<br/>
2. The User agrees that any communication sent by the User vide e-mail, shall imply release of
information therein/ therewith to CMC. The User agrees to be contacted via e-mail on such mails
initiated by him/ her. 
<br/>
3. In addition to the information already in the possession of CMC and/ or the Payment Service
Provider(s), CMC may have collected similar information from the User in the past. By entering the
Website the User consents to the terms of CMC’s information privacy policy and to our continued
use of previously collected information. By submitting the User’s personal information to us, the
User will be treated as having given his/her permission for the processing of the User’s personal data
as set out herein. 
<br/>
4. The User acknowledges and agrees that his/ her information will be managed in accordance with
the laws for the time in force.
<Typography variant="h5" style={{ fontWeight: 'bold' }}>G. Payment Gateway Disclaimer  </Typography>
The Service is provided in order to facilitate payment of CMC online. CMC or the Payment Service
Provider(s) do not make any representation of any kind, express or implied, as to the operation of
the Payment Gateway other than what is specified in the Website for this purpose. By accepting/
agreeing to these Terms and Conditions, the User expressly agrees that his/ her use of the aforesaid
online payment Service is entirely at own risk and responsibility of the User.
            </>
          )}
        </Typography>
      </MainCard>
    </>
  );
};

export default TeamCondition;
